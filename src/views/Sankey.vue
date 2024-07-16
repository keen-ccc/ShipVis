<script setup>
import * as d3 from 'd3'
import { onMounted,computed,watch} from 'vue'
import * as d3Sankey from "d3-sankey"
//import data from "../../character/month_1.json"
import {useMonthStore} from '../stores/counter'
const monthStore = useMonthStore()
let data = computed(()=>{
    return monthStore.characterResult
})
console.log(data.value)
onMounted(() => {
    if(data.value !== null){
        renderSankey()
    }
    //renderSankey()
})
const renderSankey = () => {
    const margin = { top: 10, right: 10, bottom: 5, left: 10 }
    const width = document.getElementById('sankey').offsetWidth - margin.left - margin.right
    const height = document.getElementById('sankey').offsetHeight - margin.top - margin.bottom

    const svg = d3.select("#sankey")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('transform', `translate(${margin.left},${margin.top})`)

    // const textSvg = d3.select("#sankey")
    //     .insert("svg", ":first-child")
    //     .attr("width", width)
    //     .attr("height", 15)
    //     .attr('transform', `translate(${margin.left},${margin.top})`)
    // textSvg.append("text")
    //     .attr("x", 0)
    //     .attr("y", 10)
    //     .attr("text-anchor", "right")
    //     .attr('font-size', '12px')
    //     .text("船舶数量")
    // textSvg.append("text")
    //     .attr("x", width / 3)
    //     .attr("y", 10)
    //     .attr("text-anchor", "middle")
    //     .attr('font-size', '12px')
    //     .text("捕鱼类型")
    // textSvg.append("text")
    //     .attr("x", width / 3 + width / 3)
    //     .attr("y", 10)
    //     .attr("text-anchor", "middle")
    //     .attr('font-size', '12px')
    //     .text("航程时间")
    // textSvg.append("text") 
    //     .attr("x", width - 25)
    //     .attr("y", 10)
    //     .attr("text-anchor", "middle")
    //     .attr('font-size', '12px')
    //     .text("离岸距离")

    //绘制Sankey图
    const sankey = d3Sankey.sankey()
        .nodeWidth(4)
        .nodePadding(10)
        .nodeAlign(d3Sankey.sankeyJustify)//对齐方式: sankeyJustify、sankeyCenter、sankeyLeft、sankeyRight
        .size([width, height])
    const { nodes, links } = sankey(data.value)
    console.log(nodes, links)
    //绘制节点
    svg.append("g")
        .selectAll("rect")
        .data(nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => d.color)
        .append("title")
        .text(d => `${d.name}\n${d.value.toLocaleString()}`) 
                
    //创建渐变
    // const gardient = svg.append('defs')
    //     .selectAll('linearGradient')
    //     .data(links)
    //     .enter()
    //     .append('linearGradient')
    //     .attr('id', (d, i) => `gradient-${i}`)
    //     .attr('gradientUnits', 'userSpaceOnUse')
    //     .attr('x1', d => d.source.x1)
    //     .attr('y1', d => d.source.y1)
    //     .attr('x2', d => d.target.x0)
    //     .attr('y2', d => d.target.y0)
    // gardient.append('stop')
    //     .attr('offset', '0%')
    //     .attr('stop-color', d => d.source.color)
    // gardient.append('stop')
    //     .attr('offset', '100%')
    //     .attr('stop-color', d => d.target.color)
        
    //绘制连线
    svg.append("g")
        .attr("fill", "none")
        .selectAll("g")
        .data(links)
        .join("path")
        .attr("d", d3Sankey.sankeyLinkHorizontal())
        .attr("stroke",'#a9cddc')
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", d => d.width)
        .append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()}`)
    //绘制节点名称
    svg.append("g")
        .style("font", "10px sans-serif")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 - 30 : d.x0 - 50)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        //.attr("text-anchor", d => d.y0 < height / 2 ? "start" : "end")
        .text(d => d.name)

    // 添加交互：鼠标移入节点时，高亮显示与该节点相关的连线
    svg.selectAll("rect")
        .on("click", function (d) {
            // 点击事件处理函数
            const clickedRect = d3.select(this);
            const isHighlighted = clickedRect.attr("data-highlighted") === "true";

            if (isHighlighted) {
                // 如果已经高亮显示，则恢复原始状态
                svg.selectAll("path")
                    .style("stroke-opacity", 0.2); // 设置所有连线的透明度为1
                clickedRect.attr("data-highlighted", "false");
            } else {
                // 如果未高亮显示，则高亮显示与当前节点相关的连线
                svg.selectAll("path")
                    .style("stroke-opacity", 0.2) // 设置所有连线的透明度为0.1
                    .filter(link => link.source === d.srcElement.__data__ || link.target === d.srcElement.__data__) // 过滤出与当前节点相关的连线
                    .style('stroke','#c2dfe7')
                    .style("stroke-opacity", 0.9) // 设置当前连线的透明度为1，高亮显示
                clickedRect.attr("data-highlighted", "true");
            }
        });

    // 添加交互：鼠标点击连线时，高亮显示该连线
    svg.selectAll("path")
        .on("click", function (d) {
            const clickedPath = d3.select(this);
            const isHighlighted = clickedPath.attr("data-highlighted") === "true";
            if(isHighlighted){
                svg.selectAll("path")
                    .style("stroke-opacity", 0.2); // 设置所有连线的透明度为1
                clickedPath.attr("data-highlighted", "false");
            }
            else{
                // 鼠标移入事件处理函数
                svg.selectAll("path")
                    .style("stroke-opacity", 0.2) // 设置所有连线的透明度为0.1
                d3.select(this)
                    .style('stroke','#c2dfe7')
                    .style("stroke-opacity", 0.9) // 设置当前连线的透明度为1，高亮显示
                clickedPath.attr("data-highlighted", "true");
            }    
        })
    //svg.attr('transform','rotate(90)')

}
const redrawSankey = () => {
    d3.select("#sankey").select("svg").remove()
    renderSankey()
}
watch(data, (value) => {
    console.log(value)
    redrawSankey()
})
</script>
<template>
    <div id="sankey" style="height:70vh"></div>
</template>
<style scoped>

</style>