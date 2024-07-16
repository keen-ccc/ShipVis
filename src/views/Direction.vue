<script setup>
import { computed, onMounted, watch } from 'vue';
import * as d3 from 'd3';
import {useSearchStore} from '../stores/counter'
import {useChangeStore} from '../stores/counter'
import { reactive } from 'vue';
// 导入json数据
import data from "../../test.json";

const searchStore = useSearchStore()
const searchResult = computed(() => searchStore.$state.searchResult)
//console.log(searchResult)
const changeStore = useChangeStore()
let changeResult = computed(() => changeStore.changeResult)
// const changeResult = changeStore.changeResult
console.log(changeResult.value)
const count = computed(() => {
    return Array.isArray(searchResult.value) ? searchResult.value.length : 0;
});
// 将经度和纬度的字符串格式转换为数值格式并过滤掉无效的值
const lonValues = computed(() => {
    if(searchResult.value){
        return searchResult.value.map(d => parseFloat(d[2])).filter(value => !isNaN(value));
    }
    else{
        return []
    }
}) 
const latValues = computed(() => {
    if(searchResult.value){
        return searchResult.value.map(d => parseFloat(d[1])).filter(value => !isNaN(value));
    }
    else{
        return []
    }
})
// 获取经度和纬度的最大值
const maxLonValue = computed(() => Math.max(...lonValues.value));
const maxLatValue = computed(() => Math.max(...latValues.value));
const minLonValue = computed(() => Math.min(...lonValues.value));
const minLatValue = computed(() => Math.min(...latValues.value));

const tickLonInterval = computed(() => (maxLonValue.value - minLonValue.value) / 4);
const tickLatInterval = computed(() => (maxLatValue.value - minLatValue.value) / 4);
//minLonValue = minLonValue - tickLonInterval
//minLatValue = minLatValue - tickLatInterval
const adjustedMaxLonValue = computed(() => maxLonValue.value + tickLonInterval.value / 2);
const adjustedMaxLatValue = computed(() => maxLatValue.value + tickLatInterval.value / 2);

const radarData = reactive({
    '1_1': [],
    '1_2': [],
    '1_3': [],
    '1_4': [],
    '2_1': [],
    '2_2': [],
    '2_3': [],
    '2_4': [],
    '3_1': [],
    '3_2': [],
    '3_3': [],
    '3_4': [],
    '4_1': [],
    '4_2': [],
    '4_3': [],
    '4_4': []
});

onMounted(() => {
    renderChart();
    
});
const generateRadarData = (row, col) => {
        const radarData = [];
        const startLon = minLonValue.value + (col - 1) * tickLonInterval.value;
        const endLon = minLonValue.value + col * tickLonInterval.value;
        const startLat = minLatValue.value + (row - 1) * tickLatInterval.value;
        const endLat = minLatValue.value + row * tickLatInterval.value;
        // console.log(startLon, endLon, startLat, endLat)
        for (let i = 0; i < 8; i++) {
            const direction = getDirection(i);
            const count = getCountInRegion(startLon, endLon, startLat, endLat, direction);
            //console.log(direction, count);
            radarData.push({ direction, value: count });
        }

        return radarData;
}

const getDirection = (index) => {
        const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
        return directions[index];
}

const directionRanges = {
    'North': [0, 45],
    'Northeast': [45, 90],
    'East': [90, 135],
    'Southeast': [135, 180],
    'South': [180, 225],
    'Southwest': [225, 270],
    'West': [270, 315],
    'Northwest': [315, 360]
};

const getCountInRegion = (startLon, endLon, startLat, endLat, direction) => {
    let direction_count = 0;
    const [minAngle, maxAngle] = directionRanges[direction];
    for (let i = 0; i < count.value; i++) {
        const lon = parseFloat(searchResult.value[i][2]);
        const lat = parseFloat(searchResult.value[i][1]);
        //console.log(lon, lat);
        const angle = searchResult.value[i][4];
        if(lon > startLon && lon <= endLon && lat > startLat && lat <= endLat) {
            if (angle >= minAngle && (angle < maxAngle || (direction === 'Northwest' && angle >= maxAngle))) {
                direction_count++;
            }
        }
    }
    return direction_count;
}
const renderChart = (max_value) => {
    const width = document.getElementById('directionChart').offsetWidth; // 设置画布宽度
    const height = document.getElementById('directionChart').offsetHeight; // 设置画布高度 
    // const width = 500; // 设置画布宽度
    // const height = 500; // 设置画布高度
    const margin = { top: 5, right: 20, bottom: 30, left: 30 }; // 设置边距

    const svg = d3
        .select('#directionChart') // 选择要渲染图表的容器元素
        .append('svg') // 在容器中添加一个svg元素
        .attr('width', width) // 设置svg宽度
        .attr('height', height) // 设置svg高度
        .append('g') // 在svg中添加一个g元素，用于放置坐标轴和数据点
        .attr('transform', `translate(${margin.left},${margin.top})`); // 设置g元素的偏移量

    //console.log(minLonValue.value, maxLonValue.value, minLatValue.value, maxLatValue.value)    
    const tickLonValues = computed(() => [
        minLonValue.value + tickLonInterval.value,
        minLonValue.value + 2 * tickLonInterval.value,
        minLonValue.value + 3 * tickLonInterval.value,
        minLonValue.value + 4 * tickLonInterval.value
    ]);

    const tickLatValues = computed(() => [
        minLatValue.value + tickLatInterval.value,
        minLatValue.value + 2 * tickLatInterval.value,
        minLatValue.value + 3 * tickLatInterval.value,
        minLatValue.value + 4 * tickLatInterval.value
    ]);
    //const timeTickCount = Math.min(count, 5); // 设置最大显示时间数量为10个
    // 创建x轴比例尺
    const xScale = d3.scaleLinear()
        .domain([minLonValue.value, adjustedMaxLonValue.value]) // 设置x轴的数据范围
        .range([0, width - margin.left]); // 设置x轴的像素范围

    // 创建y轴比例尺
    const yScale = d3.scaleLinear()
        .domain([minLatValue.value, adjustedMaxLatValue.value]) // 设置y轴的数据范围
        .range([height - margin.bottom, 0]); // 设置y轴的像素范围

    // 创建x轴
    const xAxis = d3.axisBottom(xScale).tickValues(tickLonValues.value).tickSizeOuter(0); // 设置x轴的位置

    // 创建y轴
    const yAxis = d3.axisLeft(yScale).tickValues(tickLatValues.value).tickSizeOuter(0); // 设置y轴的位置

    // 在svg中添加x轴
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(xAxis);

    // 在svg中添加y轴
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${ margin.left}, 0)`)
        .call(yAxis);

    radarData['1_1'] = generateRadarData(1, 1);
    radarData['1_2'] = generateRadarData(1, 2);
    radarData['1_3'] = generateRadarData(1, 3);
    radarData['1_4'] = generateRadarData(1, 4);
    radarData['2_1'] = generateRadarData(2, 1);
    radarData['2_2'] = generateRadarData(2, 2);
    radarData['2_3'] = generateRadarData(2, 3);
    radarData['2_4'] = generateRadarData(2, 4);
    radarData['3_1'] = generateRadarData(3, 1);
    radarData['3_2'] = generateRadarData(3, 2);
    radarData['3_3'] = generateRadarData(3, 3);
    radarData['3_4'] = generateRadarData(3, 4);
    radarData['4_1'] = generateRadarData(4, 1);
    radarData['4_2'] = generateRadarData(4, 2);
    radarData['4_3'] = generateRadarData(4, 3);
    radarData['4_4'] = generateRadarData(4, 4);
    
    console.log("data_1_1",radarData['1_1'])
    
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            //const radarData = generateRadarData(i, j)
            //const radarData = eval(`radarData_${i}_${j}`)
            const key = `${i}_${j}`;
            const currentRadarData = radarData[key];
            // console.log(radarData)
            const radarRadius = Math.min((width - margin.left)/10, (height - margin.bottom)/10); // 雷达图半径

            const radarScale = d3.scaleLinear()
                .domain([0, changeResult.value==false ? d3.max(currentRadarData,d => d.value) || 1 : max_value]) // 设置雷达图的数据范围，如果最大值为0，则使用默认值1
                .range([0, radarRadius]); // 设置雷达图的半径范围

            //console.log(d3.max(radarData,d => d.value))

            const radarLine = d3.lineRadial()
                .angle((d, i) => i * (Math.PI * 2) / currentRadarData.length) // 设置雷达图的角度
                .radius(d => radarScale(d.value)) // 设置雷达图的半径
                .curve(d3.curveCardinalClosed); // 闭合雷达图
                
            const radarChartGroup = svg.append('g')
                .attr('class', 'radar-chart')
                .attr('transform', `translate(${j * (width - margin.left)/4.30}, ${height - margin.bottom - i * (height - margin.bottom)/4.5})`)
                .on('click', function() {
                    //console.log("Click:", i, j);
                    //console.log("Data:", radarData);
                    //该区域的经纬度范围
                    const startLon = minLonValue.value + (j - 1) * tickLonInterval.value;
                    const endLon = minLonValue.value + j * tickLonInterval.value;
                    const startLat = minLatValue.value + (i - 1) * tickLatInterval.value;
                    const endLat = minLatValue.value + i * tickLatInterval.value;
                    //console.log(startLon, endLon, startLat, endLat);
                    //找出json数据中该区域的数据
                    const regionData = searchResult.value.filter(d => {
                        const lon = parseFloat(d[2]);
                        const lat = parseFloat(d[1]);
                        return lon > startLon && lon <= endLon && lat > startLat && lat <= endLat;
                    });
                    //传递给DirectionSpeed子组件

                });

            radarChartGroup.append('path')
                .datum(currentRadarData)
                .attr('class', 'radar-line')
                .attr('d', radarLine)
                .attr('fill', '#aad3df')
                .attr('fill-opacity', 0.7)
                .attr('roundStrokes', true)
                .attr('stroke', '#5194b0')
                .attr('stroke-width', 2);

            // 添加数据点小圆点
            const circles = radarChartGroup.selectAll('.radar-circle')
                .data(currentRadarData)
                .enter()
                .append('circle')
                .attr('class', 'radar-circle')
                .attr('cx', (d, k) => {
                    // console.log("Data:", d);
                    // console.log("Index:", k);
                    return radarScale(d.value) * Math.sin(k * (Math.PI * 2) / currentRadarData.length);
                })
                .attr('cy', (d, k) => {
                    // console.log("Data:", d);
                    // console.log("Index:", k);
                    return -radarScale(d.value) * Math.cos(k * (Math.PI * 2) / currentRadarData.length);
                })
                .attr('r', 3) // 设置小圆环半径
                .attr('fill', '#3d88ab')
                .attr('fill-opacity', 0.7)
                .attr('stroke', '#3d88ab')
                .attr('stroke-width', 1)
                .style('opacity',1); // 默认隐藏

            // 悬停时显示数值
            circles.on('mouseover', function() {
                // console.log
                const d = d3.select(this).data()[0]; // 获取数据点的数据对象
                //console.log("Mouseover Data:", d);
                // 添加文本显示数值
                const parentGroup = d3.select(this.parentNode);
                parentGroup.append('text')
                    .attr('class', 'radar-value')
                    .attr('x', Math.sin((0*Math.PI * 2) / 8) * radarRadius) // 设置文本水平位置为鼠标水平位置
                    .attr('y',  -Math.cos(4*(Math.PI * 2) / 8) * radarRadius + 12) // 设置文本垂直位置为鼠标垂直位置加偏移量
                    .text(d.direction + ':' + d.value)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'black');
            })
            .on('mouseout', function() {
                d3.select(this).style('opacity', 1);
                // 移除文本
                radarChartGroup.selectAll('.radar-value').remove();
            });

            // 添加多个雷达图圆环 层次效果
            const circleRadii = [0.25, 0.5, 0.75, 1.0]; // 圆环半径比例
            circleRadii.forEach((radius) => {
                radarChartGroup.insert('circle', ':first-child') // 将圆环插入到小圆点之前
                    .attr('class', 'radar-circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', radarRadius * radius)
                    .attr('fill', 'black')
                    .attr('stroke', 'black')
                    .attr('stroke-opacity', 0.2)
                    .attr('fill-opacity', 0.02)
                    .attr('stroke-width', 0.5);
                    // .attr('fill', 'none')
                    // .attr('stroke', 'gray')
            });
        }
    }
    //给每个雷达图添加点击数据

}
const changeChart = () => {
    d3.select('#directionChart').selectAll('svg').remove();

    //所有数据中value最大值
    let max_value = 0;
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            const key = `${i}_${j}`;
            const currentRadarData = radarData[key];
            const max = d3.max(currentRadarData, d => d.value);
            if (max > max_value) {
                max_value = max;
            }
        }
    }
    renderChart(max_value);
}
const redrawRadarChart = () => {
    d3.select('#directionChart').selectAll('svg').remove();
    renderChart();
}
// 监听changeResult和searchResult的变化
watch(searchResult, (value) => {
    redrawRadarChart();
})
watch(changeResult, (value) => {
    changeChart();
})
</script>

<template>
    <!-- <div style="margin:0 auto; text-align: center;padding:10px">
        <el-button type="primary" @click="redrawRadarChart">Change View</el-button>
    </div> -->
    <div id="directionChart" style="height:40vh" > </div>
</template>
<style scoped>

</style>