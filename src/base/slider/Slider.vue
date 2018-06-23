<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        :class="{active: currentIndex === index}"
        v-for="(item, index) of dots"
        :key="index"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
  name: 'Slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [],
      currentIndex: 0,
      slider: null,
      updateNumber: false
    }
  },
  methods: {
    _setSliderWidth (isResize) {
      // this.children.length的值是变化的，slider初始化之前为5，之后为5
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth // 元素可视区域的宽度, 取决于slider-wrapper
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots () {
      // 这时length为5
      this.dots = new Array(this.children.length)
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on('scrollEnd', () => {
        // 无论手动滑动还是自动滑动都会触发这个事件
        this.currentIndex = this.slider.getCurrentPage().pageX
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  updated () {
    if (!this.updateNumber) {
      this._setSliderWidth(false)
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }

        this._setSliderWidth(true)
        this.slider.refresh()
      })

      this.updateNumber = true
    }
  },
  destroyed () { // 切换路由的时候
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import "~common/stylus/variable"

.slider
  width: 100%
  position: relative
  .slider-group
    width: 100%
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
