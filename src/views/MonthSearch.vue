<template>
    <div style="height:6vh;text-align:center">
        <div style="margin-top:1vh;">
            <el-date-picker
            v-model="monthValue"
            type="month"
            placeholder="Pick a month"
            :default-value="parseDate('2020-01-01')"
            style="width: 30vh;"
          />
          <el-button type="primary" icon="Search" @click="monthSearch">搜索</el-button> 
        </div>       
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {useMonthStore} from '../stores/counter'
const monthStore = useMonthStore()
const monthValue = ref('')

const monthSearch = () => {
    const month = monthValue.value.getMonth() + 1
    monthStore.searchMonth(month)
    monthStore.characterSearch(month)
    //console.log(month)
}

const parseDate = (date) => {
    return new Date(date)
}
</script>

<style>

</style>