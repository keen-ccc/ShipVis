import * as d3 from 'd3'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'  // 引入Element Plus 所需的样式文件
import './assets/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//import {useCounterStore} from './stores/counter'


const app = createApp(App)
// 全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(createPinia())
app.use(router)
//app.use(useCounterStore)
app.use(ElementPlus)
app.mount('#app')
