import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapDemo from '../views/MapDemo.vue'
import MonthSearch from '../views/MonthSearch.vue'
import ShipSearch from '../views/ShipSearch.vue'
import DirectionSpeed from '../views/DirectionSpeed.vue'
import DistanceSpeed from '../views/DistanceSpeed.vue'
import Direction from '../views/Direction.vue'
import Sankey from '../views/Sankey.vue'
import bar from '../views/bar.vue'
import ChangeView from '../views/ChangeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path:'bar',
          name:'bar',
          component:bar
        },
        {
          path:'mapdemo',
          name:'mapdemo',
          component:MapDemo
        },
        {
          path:'monthsearch',
          name:'monthsearch',
          component:MonthSearch
        },
        {
          path:'shipsearch',
          name:'shipsearch',
          component:ShipSearch
        },
        {
          path:'changeview',
          name:'changeview',
          component:ChangeView
        },
        {
          path:'directionspeed',
          name:'directionspeed',
          component:DirectionSpeed,
        },
        {
          path:'distancespeed',
          name:'distancespeed',
          component:DistanceSpeed,
        },
        {
          path:'direction',
          name:'directions',
          component:Direction,
        },
        {
          path:'sankey',
          name:'sankey',
          component:Sankey
        }
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
