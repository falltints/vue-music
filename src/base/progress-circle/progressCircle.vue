<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle
        class="progress-background"
        cx="50"
        cy="50"
        r="50"
        fill="transparent"
      ></circle>
      <circle
        class="progress-bar"
        cx="50"
        cy="50"
        r="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      ></circle>
      <!--stroke-dasharray="实线长度 虚线长度" 如果只有一个值，则实线长度和虚线长度都为此值-->
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ProgressCircle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100 // 圆的周长为2PIr
    }
  },
  computed: {
    dashOffset () {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import "~common/stylus/variable"

.progress-circle
  position: relative
  circle
    stroke-width: 8px
    transform-origin: center
    &.progress-background
      transform: scale(0.9)
      stroke: $color-theme-d
    &.progress-bar
      transform: scale(0.9) rotate(-90deg)
      stroke: $color-theme
</style>
