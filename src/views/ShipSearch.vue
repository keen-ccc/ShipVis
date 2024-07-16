<template>
  <div style="height:6vh;text-align:center">
    <div style="margin-top:1vh">
        <el-input placeholder="请输入船舶ID" v-model="input" clearable style="width:30vh"></el-input>
        <el-button type="primary" icon="Search" @click="search">搜索</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {useSearchStore} from '../stores/counter'
const searchStore = useSearchStore()

const input = ref("");

const search = () => {
    searchStore.searchShip(input.value)
    console.log(input.value)
}
</script>

<style>

</style>