<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from 'components/music-header/Music-Header'
import Tab from 'components/tab/Tab'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab
  }
}
</script>

<style>

</style>
