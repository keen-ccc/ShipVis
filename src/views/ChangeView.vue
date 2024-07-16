<template>
    <div style="margin:0 auto; text-align: center;padding:10px">
        <el-button type="primary" @click="redrawRadarChart">视角切换</el-button>
    </div>
</template>

<script setup>
import {useChangeStore} from '../stores/counter'
const changeStore = useChangeStore()
const redrawRadarChart = () => {
    changeStore.changeView()
    //console.log(changeStore.changeResult)
}
</script>

<style>

</style>