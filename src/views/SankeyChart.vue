<template>
    <div ref="sankey" style="height: 75vh;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const sankey = ref(null);
let myChart;

onMounted(() => {
    myChart = echarts.init(sankey.value);
    const option = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        animation: false,
        series: [
            {
                type: 'sankey',
                bottom: '10%',
                emphasis: {
                    focus: 'adjacency',
                    blurScope: 'others',
                    itemStyle: {
                        color: '#76b7b2'
                    },
                    lineStyle: {
                        color: '#76b7b2',
                        curveness: 0.5
                    }
                },
                data: [
                    { name: 'a'},
                    { name: 'b' },
                    { name: 'a1' },
                    { name: 'b1' },
                    { name: 'c' },
                    { name: 'e' }
                ],
                links: [
                    { source: 'a', target: 'a1', value: 5 },
                    { source: 'e', target: 'b', value: 3 },
                    { source: 'a', target: 'b1', value: 3 },
                    { source: 'b1', target: 'a1', value: 1 },
                    { source: 'b1', target: 'c', value: 2 },
                    { source: 'b', target: 'c', value: 1 }
                ],
                orient: 'vertical',
                itemStyle: {
                    color: '#ececec'
                },
                label: {
                    position: 'top'
                },
                lineStyle: {
                    color: '#ececec',
                    curveness: 0.5
                },
                
            }
        ]
    };

    myChart.setOption(option);
});
</script>

<style>

</style>