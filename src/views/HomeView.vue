<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import HeatMap from '../views/HeatMap.vue'
import MapDemo from '../views/MapDemo.vue'
import MonthSearch from '../views/MonthSearch.vue'
import ShipSearch from '../views/ShipSearch.vue'
import DirectionSpeed from '../views/DirectionSpeed.vue'
import DistanceSpeed from '../views/DistanceSpeed.vue'
import Direction from '../views/Direction.vue'
import Sankey from '../views/Sankey.vue'
import bar from '../views/bar.vue'
import ChangeView from '../views/ChangeView.vue'
import {ref} from 'vue'
import {useStore} from 'vuex'

const store = useStore()

</script>

<template>
  <el-container style="height:100vh">
    <el-header style="height:4vh;--el-header-padding:0px">
      <bar />
    </el-header>
    <el-main style="height:100vh;--el-main-padding:1px;overflow:hidden">
      <el-row>
        <el-col :span="7">
          <!-- <ShipSearch />
          <DirectionSpeed /> -->
          <el-row style="height:24vh;border:1.5px solid #a4a4a4">
            <el-col :span="24">
              <ShipSearch />
              <MonthSearch />
              <ChangeView />
            </el-col>
          </el-row>
          <el-row style="height:72vh;border:1.5px solid #a4a4a4">
            <el-col :span="24">
              <!-- <DirectionSpeed /> -->
              <!-- <DistanceSpeed /> -->
              <Sankey />
              <!-- <SankeyCharts /> -->
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8.5" style="  border: 1.5px solid #a4a4a4;margin-left:2px; ">
          <!-- <MonthSearch /> -->
          <MapDemo />
          <!-- <HexbinMap /> -->
        </el-col>
        <el-col :span="8" style="margin-left:1px;width:100px">
          <el-row style="height:42vh;border: 1.5px solid #a4a4a4;">
            <el-col :span="24">
              <Direction />
            </el-col>
          </el-row>
          <el-row style="height:55vh;border: 1.5px solid #a4a4a4;margin-top:2px">
            <el-col :span="24">
              <!-- <Sankey /> -->
              <DistanceSpeed />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<style scoped>

</style>
