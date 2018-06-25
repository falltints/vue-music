import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'components/rank/Rank'
import Recommend from 'components/recommend/Recommend'
import Singer from 'components/singer/Singer'
import Search from 'components/search/Search'
import SingerDetail from 'components/singer-detail/singerDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
