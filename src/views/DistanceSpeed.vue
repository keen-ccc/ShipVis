<template>
    <div id="DistanceSpeed" style="height:53vh;"></div>
</template>

<script setup>
import { computed, onMounted,watch } from "vue";  
import * as d3 from 'd3';
import { useSearchStore } from "@/stores/counter";
import {sliderBottom, sliderRight} from 'd3-simple-slider';
//import data from "../../test.json";

const searchStore = useSearchStore();
let searchResult = computed(() => searchStore.searchResult);

//保留shipdata的time、speed、distance
let shipdata = computed(() => {
    if (searchResult.value) {
        return searchResult.value.map(item => {
            return {
                time: item[5],
                speed: item[3],
                distance: item[7]
            }
        })
    } else {
        return [];
    }
})
//按照日期（格式为yyyy-mm-dd hh:mm:ss）将shipdata划分为多个数据，每个日期一个数据
let groupedData = computed(() => {
    return shipdata.value.reduce((acc, cur) => {
        const time = new Date(cur.time).toLocaleDateString();
        const findIndex = acc.findIndex(item => item.time === time);
        if (findIndex === -1) {
            acc.push({
                time: time,
                data: [cur]
            })
        } else {
            acc[findIndex].data.push(cur)
        }
        return acc;
    }, []);
});
//console.log(shipdata) 
//是否点击
let isClick = false;

//t统计数据的date、distance和speed
const dates = computed(() => groupedData.value ? [...new Set(groupedData.value.map(d => d.time))] : []);
const distances = computed(() => groupedData.value ? [].concat(...groupedData.value.map(d => d.data.map(d => d.distance))) : []);
const speeds = computed(() => groupedData.value ? [].concat(...groupedData.value.map(d => d.data.map(d => d.speed))) : []);

const colorScale = computed(() => d3.scaleSequential(d3.interpolateRgbBasis(['#3985aa', '#67a9cf', '#f3efec', '#f9c8af', '#e88b6f', '#c5413f'])).domain([0, d3.max(speeds.value)]));
const colorDateScale = computed(() => d3.scaleOrdinal().domain(dates.value).range(['#a9d6e5', '#89c2d9', '#61a5c2','#468faf','#2c7da0','#2a6f97','#014f86','#01497c','#013a63','#012a4a']));

onMounted(() => {
    renderChart();
})

const renderChart = () => {
    const width = document.getElementById('DistanceSpeed').offsetWidth;
    const height = document.getElementById('DistanceSpeed').offsetHeight;
    // const width = 300;
    // const height = 500;
    const radius = Math.min(width,height) / 2 - 40;
    //距离比例尺
    const distanceScale = computed(() => d3.scaleLinear()
    .domain([0, d3.max(distances.value)])
    .range([radius, 0])) 
    //时间比例尺
    const timeScale = d3.scaleLinear()
        .domain([0, 86400])//一天的秒数
        .range([0, 24])//24小时
    const svg = d3.select('#DistanceSpeed')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        //.attr('transform', `translate(${width / 2}, ${height / 2})`)
    // 绘制一个编码24小时的钟表
    svg.append('circle')
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', '#61a5c2')
        .attr('stroke-width',2)
        .attr('transform', `translate(${width / 2}, ${height / 2 + 10})`)

    //添加多个圆环效果
    const circleRadius = [0.25, 0.5, 0.75].map(d => radius * d)
    circleRadius.forEach(d => {
        svg.append('circle')
            .attr('r', d)
            .attr('fill', 'black')
            .attr('stroke', 'black')
            .attr('transform', `translate(${width / 2}, ${height / 2 + 10})`)
            .attr('fill-opacity', 0.025)
            .attr('stroke-opacity', 0.15)
            .attr('stroke-width', 0.5)

        //添加距离刻度标注（max-distance -> min-distance）
        svg.append('text')
            .text(d3.format('.2f')(distanceScale.value.invert(d))+' km')
            .attr('x', width / 2)
            .attr('y', height / 2 +20- d)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', '12px')
            //.style('font-weight', 'bold')
    })
    //添加从圆心到圆周的线段（24条）
    for(let i = 0;i<24;i++){
        svg.append('line')
            .attr('x1', width / 2)
            .attr('y1', height / 2 + 10)
            .attr('x2', width / 2 + radius * Math.cos(i * 2 * Math.PI / 24))
            .attr('y2', height / 2 + radius * Math.sin(i * 2 * Math.PI / 24) + 10)
            .attr('stroke', '#d6d6d6')
    }
    //圆心
    svg.append('circle')
        .attr('r', 3)
        .attr('fill', 'black')
        .attr('transform', `translate(${width / 2}, ${height / 2 + 10})`)

    for (let i = 1;i<=24;i++){
        const timeHours = timeScale(i * 3600);
        const angle = (timeHours * Math.PI)/12 - 2 * Math.PI;
        const arc = d3.arc()
            .innerRadius(radius - 5)
            .outerRadius(radius)
            .startAngle(angle)
            .endAngle(angle + 0.005)
        svg.append('path')
            .attr('d', arc)
            .attr('fill', 'black')
            .attr('transform', `translate(${width / 2}, ${height / 2 + 10})`)
        const textPosition = arc.centroid();//获取弧线的中心位置
        svg.append('text')
            .text(i)
            .attr('x', textPosition[0] * 1.1 + width / 2)
            .attr('y', textPosition[1] * 1.07 + height / 2 + 10)
            .attr('text-anchor', 'middle')
            .style('font-size',['24','6','12','18'].includes(i.toString()) ? '16px' : '12px')
            .style('font-weight',['24','6','12','18'].includes(i.toString()) ? 'bold' : 'normal')
    }
    
    let selectedDate = null//保存选择的日期
    const dateScale = computed(() => d3.scaleBand()
        .domain(groupedData.value ? groupedData.value.map(d => d.time) : [])
        .range([-Math.PI / 4, 0.25 * Math.PI]));

    //对于每个日期 创建一个拱形
    groupedData.value.forEach((d,i) => {
        const angle = dateScale.value(d.time);
        const arc = d3.arc()
            .innerRadius(radius + 32)
            .outerRadius(radius + 42)
            .startAngle(angle)
            .endAngle(angle + dateScale.value.bandwidth())
        svg.append('path')
            .attr('d', arc)
            .attr('fill', colorDateScale.value(d.time))
            .attr('stroke', '#d9d9d9')
            .attr('transform', `translate(${width / 2}, ${height / 2 + 15})`)
            .on('click',() => {
                selectedDate = d.time;
                console.log('selectedDate:',selectedDate)
                //根据选择的日期渲染对应的数据点
                svg.selectAll('#datacircle').remove();
                //只渲染选中日期的数据点
                groupedData.value.filter(d=>d.time === selectedDate).forEach(d => {
                    d.data.forEach(dd => {
                        let time = new Date(dd.time).getHours() * 3600 + new Date(dd.time).getMinutes() * 60 + new Date(dd.time).getSeconds();
                        //只保留time的时间信息，并转换成秒
                        const timeHours = timeScale(time);
                        //console.log('timeHours:',timeHours)
                        const angle = (timeHours * 2 * Math.PI) / 24 - Math.PI / 2
                        //console.log('angle:',angle)
                        const distance = distanceScale.value(dd.distance);
                        //console.log('distance:',distance)
                        const x = distance * Math.cos(angle) + width / 2;
                        const y = distance * Math.sin(angle) + height / 2 + 10;
                        svg.append('circle')
                            //id
                            .attr('id', 'datacircle')
                            .attr('cx', x)
                            .attr('cy', y)
                            .attr('r', 3.5)
                            .attr('fill', colorScale.value(dd.speed))
                            //.attr('fill-opacity', 0.5)
                            .on('click', () => {
                                isClick = !isClick;
                                if(isClick){
                                    svg.append('text')
                                    .attr('id','speedText')
                                    .text(dd.speed.toFixed(2)+' 节')
                                    .attr('x', x)
                                    .attr('y', y + 10)
                                    .attr('text-anchor', 'middle')
                                    .attr('dy', '0.35em')
                                    .style('font-size', '12px')
                                    .style('font-weight', 'bold')
                                }
                                else{
                                    svg.selectAll('#speedText').remove()
                                }

                            })
                    })
                })
            })
        const text = arc.centroid();
        const dateParts = d.time.split('/')
        const month = dateParts[1];
        const day = dateParts[2]
        svg.append('text')
        //显示月份和日期
            .text(`${month}/${day}`)//显示月份和日期
            //.text(d.time.split('/')[0])
            .attr('x', text[0] * 1.1 + width / 2)
            .attr('y', text[1] + height / 2 + 5)
            .attr('text-anchor', 'middle')
    })
    //添加控制速度的slider
    const slider = svg.append('g')
        .attr('transform', `translate(${width - 50}, ${height / 3})`)
        .call(sliderRight(d3.scaleLinear().domain([d3.min(speeds.value), d3.max(speeds.value)])).width(200)//设置滑块的长度
            .on('onchange', val => {
                svg.selectAll('#datacircle').remove();
                groupedData.value.filter(d=>d.time === selectedDate).forEach(d => {
                    d.data.forEach(dd => {
                        let time = new Date(dd.time).getHours() * 3600 + new Date(dd.time).getMinutes() * 60 + new Date(dd.time).getSeconds();
                        const timeHours = timeScale(time);
                        const angle = (timeHours * 2 * Math.PI) / 24 - Math.PI / 2
                        const distance = distanceScale.value(dd.distance);
                        const x = distance * Math.cos(angle) + width / 2;
                        const y = distance * Math.sin(angle) + height / 2;
                        if(dd.speed <= val){
                            svg.append('circle')
                                .attr('id', 'datacircle')
                                .attr('cx', x)
                                .attr('cy', y)
                                .attr('r', 3)
                                .attr('fill', colorScale.value(dd.speed))
                                .on('click', () => {
                                    isClick = !isClick;
                                    if(isClick){
                                        svg.append('text')
                                        .attr('id','speedText')
                                        .text(dd.speed.toFixed(2)+' km/h')
                                        .attr('x', x)
                                        .attr('y', y + 10)
                                        .attr('text-anchor', 'middle')
                                        .attr('dy', '0.35em')
                                        .style('font-size', '12px')
                                        .style('font-weight', 'bold')
                                    }
                                    else{
                                        svg.selectAll('#speedText').remove()
                                    }
                                })
                        }
                    })
                })
            })
            
        )
}
const redrawChart = () => {
    d3.select('#DistanceSpeed').select('svg').remove();
    renderChart();
}
//监听searchResult的变化
watch(shipdata,(value) => {
    console.log('shipdata:',value)
    //重新绘图
    redrawChart();
})
</script>

<style>

</style>