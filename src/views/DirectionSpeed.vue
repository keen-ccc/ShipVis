<template>
    <div class="container">
        <div id="chart" style="height:85vh;width:55vh;"></div>
        <div class="slider-container">
            <div id="color-slider" style="width:200px;height:20px;margin:2px auto;background:linear-gradient(to right, #3985aa, #c5413f);border-radius:10px;cursor:pointer">
                <div id="color-slider-thumb" style="width:20px;height:20px;background:#fff;border-radius:50%;position:relative;left:0;top:-1px;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2);cursor:pointer"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import * as d3 from 'd3';
import { max } from "d3";
import {useSearchStore} from '../stores/counter'
// 导入json数据
import data from "../../test.json";
//console.log(data)
// min_speed
// max_speed
const searchStore = useSearchStore()
const searchResult = computed(() => searchStore.searchResult)
// console.log(searchResult)

const min_speed = d3.min(data, d => d.speed);
const max_speed = d3.max(data, d => d.speed);
console.log(min_speed, max_speed)
// 数据点数量
const count = data.length;
const color = d3.scaleSequential(d3.interpolateRgbBasis(['#3985aa','#67a9cf','#f3efec', '#f9c8af','#e88b6f','#c5413f'])).domain([min_speed, max_speed]);
var width = 0
var height = 0

// 航线距离
const max_distance = d3.max(data,d=>d.distance)

onMounted(() => {
        renderChart()
        createColorSlider()
})
const createColorSlider = () => {
    const sliderDiv = document.getElementById('color-slider');    

    const thumbDiv = document.getElementById('color-slider-thumb');

    sliderDiv.appendChild(thumbDiv);
    document.getElementById('chart').appendChild(sliderDiv);

    const slider = d3.select('#color-slider');
    const thumb = d3.select('#color-slider-thumb');
    const sliderWidth = slider.node().offsetWidth;
    const thumbWidth = thumb.node().offsetWidth;
    const minThumbPosition = 0;
    const maxThumbPosition = sliderWidth - thumbWidth;

    let isDragging = false;
    let thumbPosition = 0;

    const updateChart = () => {
        const selectedSpeed = min_speed + (thumbPosition / maxThumbPosition) * (max_speed - min_speed);
        // console.log(selectedSpeed)
        const svg = d3.select('#chart svg');

        svg.selectAll('circle')
            .attr('fill', d => {
                if (d.speed >= selectedSpeed) {
                    return color(d.speed);
                } else {
                    return '#ccc';
                }
            });

        // Display speed below the slider
        const speedDisplay = d3.select('.speed-display')
            .selectAll('.speed-display-text')
            .data([selectedSpeed])
            .join('div')
            .attr('class', 'speed-display-text')
            .style('text-align', 'center')
            .style('margin-top', '10px')
            .text(d => `${d}`);
    };

    const startDrag = () => {
        isDragging = true;
        thumb.style('cursor', 'grabbing');
    };

    const endDrag = () => {
        isDragging = false;
        thumb.style('cursor', 'grab');
    };

    const drag = (event) => {
        if (isDragging) {
            const newPosition = event.clientX - slider.node().getBoundingClientRect().left - (thumbWidth / 2);
            thumbPosition = Math.max(minThumbPosition, Math.min(newPosition, maxThumbPosition));
            thumb.style('left', thumbPosition + 'px');
            updateChart();
        }
    };

    thumb.on('mousedown', startDrag);
    d3.select(window).on('mouseup', endDrag);
    d3.select(window).on('mousemove', drag);
};
const renderChart = () => {
    var chartDiv = document.getElementById('chart')
    width = chartDiv.offsetWidth
    height = chartDiv.offsetHeight - 20

    const marginTop = 10;
    const marginRight = 50;
    const marginBottom = 30;
    const marginLeft = 44;
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
          // Create a symmetric diverging color scale.
    // 创建时间轴的比例尺
    const yScaleTime = d3.scaleBand()
        .domain(data.map(d => {
            // 除去年份
            return d.time
        }))
        .range([marginTop, height - marginBottom])

        
    // 根据数据点数量更改显示时间的数量
    const timeTickCount = Math.min(count, 20); // 设置最大显示时间数量为10个
    
    const timeAxis = svg.append('g')
        .attr('transform', `translate(${(width / 2 - width / 3)}, 10)`)
        .call(d3.axisLeft(yScaleTime).tickValues(yScaleTime.domain().filter((d, i) => !(i % Math.ceil(count / timeTickCount)))));

    // 创建距离比例尺
    const distanceScale = d3.scaleLinear()
        .domain([0, max_distance])
        .range([marginLeft, width - marginRight])
    // 添加距离轴
    svg.append('g')
        .attr('transform', `translate(${(width / 2 - width / 2.39)}, 20)`)
        .call(d3.axisTop(distanceScale));
    svg.append("g")
      .attr("transform", `translate(320,0)`)
      .call(g => g.append("text")
          .attr("fill", "#000")
          .attr("x", width / 4)
          .attr("y", 30)
          .attr("dy", "0.32em")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("距离(km)"));
    svg.append('g')
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .selectAll()
        .data(data)
        .join("circle")
          .attr("cx", d => distanceScale(d.distance) + width / 2 - width / 2.39)
          .attr("cy", d => yScaleTime(d.time) + yScaleTime.bandwidth() / 2 + 10)
          .attr("fill", d => color(d.speed))
          .attr("r", 2.8)
          .append("title")
    
    // 每个散点添加悬浮事件 悬浮显示经纬度
    svg.selectAll('circle')
        .on('mouseover', (e, d) => {
            // console.log(d)
            const x = distanceScale(d.distance) + 29.5;
            const y = yScaleTime(d.time) + yScaleTime.bandwidth() / 2 + 10;
            svg.append('text')
                .attr('id', 'tooltip')
                .attr('x', x - 100)
                .attr('y', y)
                // 保留两位小数
                .text(`(${d.lon.toFixed(2)}, ${d.lat.toFixed(2)})`)
        })
        .on('mouseout', () => {
            svg.select('#tooltip').remove()
        })
}

</script>

<style>
.container {
  height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>