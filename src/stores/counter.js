import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios' 
import month_1 from '../../character/month_1.json'
import month_2 from '../../character/month_2.json'
import month_3 from '../../character/month_3.json'
import month_4 from '../../character/month_4.json'
import month_5 from '../../character/month_5.json'
import month_6 from '../../character/month_6.json'
import month_7 from '../../character/month_7.json'
import month_8 from '../../character/month_8.json'
import month_9 from '../../character/month_9.json'
import month_10 from '../../character/month_10.json'
import month_11 from '../../character/month_11.json'

// 这段代码创建了一个 Pinia store，
//用于管理搜索相关的状态。
//它包含了一个名为 searchResult 的状态属性，一个名为 searchShip 的操作用于执行搜索请求，并且提供了一个名为 searchResult 的 getter 用于获取搜索结果。
//根据 ID 搜索船舶
export const useSearchStore = defineStore('search',{
  state: () => ({
    searchResult:null
  }),
  actions: {
    async searchShip(searchItem){
      // 执行搜索请求，将结果保存到状态中
       let response = await fetchSearchResult(searchItem)
       //console.log(response)
       //const data = await response.json()
       this.searchResult = response
       //console.log(this.searchResult)
      //const response = 'this is test'
      
    }
  },
  getters: {
    getSearchResult: state => state.searchResult // 返回搜索结果
  }
})

// Change View
export const useChangeStore = defineStore('change',{
  state: () => ({
    changeResult:false
  }),
  actions: {
    async changeView(){
      this.changeResult = !this.changeResult
    }
  },
  getters: {
    getChangeResult: state => state.changeResult
  }
})

//按照 [月份] 搜索船舶数据
export const useMonthStore = defineStore('month',{
  state: () => ({
    monthResult:null,
    characterResult:null
  }),
  actions: {
    async searchMonth(monthItem){
      // 执行搜索请求，将结果保存到状态中
       let response = await fetchMonthResult(monthItem)
       //console.log(response)
       //const data = await response.json()
       this.monthResult = response
       //console.log(this.searchResult)
      //const response = 'this is test'
      
    },
    async characterSearch(monthItem){
      //this.characterResult = month_{monthItem}
      //根据monthItem的值返回对应的json数据
      const character = [month_1,month_2,month_3,month_4,month_5,month_6,month_7,month_8,month_9,month_10,month_11]
      this.characterResult = character[monthItem-1]
      console.log(this.characterResult)
    }
  },
  getters: {
    getMonthResult: state => state.monthResult

  }
})

// 这是一个模拟的搜索请求函数
async function fetchSearchResult(searchItem){
  const response = await axios.get(`http://localhost:5000/api/ship_search/${searchItem}`)
  return response.data
}
async function fetchMonthResult(monthItem){
  const response = await axios.get(`http://localhost:5000/api/month_search/${monthItem}`)
  return response.data
}
