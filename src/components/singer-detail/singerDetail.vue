<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import '~common/stylus/variable.styl'

.singer-detail
  position: fixed
  z-index: 100
  top: 0
  bottom: 0
  left: 0
  right: 0
  background: $color-background
.slide-enter-active, .slide-leave-active
  transition: all 300ms
.slide-enter, .slide-leave-to // 一个是进入开始的位置，另一个是离开结束的位置
  transform: translate3d(100%, 0, 0)
</style>
