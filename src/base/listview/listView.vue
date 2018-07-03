<template>
  <scroll
    class="listview"
    :data="data"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
    ref="listview"
  >
    <ul>
      <li
        class="list-group"
        v-for="group of data"
        :key="group.title"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item of group.items"
            :key="item.id"
            @click="selectItem(item)"
          >
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul @touchstart="onShortcutTouchStart"
          @touchmove.stop.prevent="onShortcutTouchMove"
      >
      <!--stop阻止事件冒泡，prevent阻止元素的默认行为-->
        <li
          class="item"
          :class="{current: currentIndex === index}"
          v-for="(item, index) of shortcutList"
          :key="item"
          :data-index="index"
        >{{ item }}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/Scroll'
import Loading from 'base/loading/Loading'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18 // 每一个字母索引的高度
const TITLE_HEIGHT = 30

export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    // 由data取到alphabet
    shortcutList () {
      // map方法返回一个新数组
      return this.data.map((group) => {
        return group.title.substr(0, 1) // 只取前一个字符
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      // 移动端touch事件与click事件的关系：
      // 手指点击一个元素，会经过：touchstart --> touchmove -> touchend --》click。
      let anchorIndex = parseInt(getData(e.target, 'index')) // 获取到当前index值
      this.currentIndex = anchorIndex
      let currentTouch = e.touches[0]
      // pageX和pageY属性是相对于整个document而言的
      this.touch.originalY = currentTouch.pageY
      this.touch.originalIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let currentTouch = e.touches[0]
      let currentY = currentTouch.pageY
      let delta = Math.floor((currentY - this.touch.originalY) / ANCHOR_HEIGHT)
      let anchorIndex = this.touch.originalIndex + delta
      this.currentIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    scroll (pos) {
      this.scrollY = pos.y // scrollY为负值
    },
    _scrollTo (index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // {Number} time 滚动动画执行的时长（单位 ms）
    },
    _calculateHeight () { // 得到一个数组，数组里面是每个listGroup距离顶部的距离
      this.listHeight = []
      let listGroups = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < listGroups.length; i++) {
        height += listGroups[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      // 因为从接受到数据到DOM渲染需要一定的时间
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 滚动到中间部分
      for (let i = 0; i < (listHeight.length - 1); i++) {
        let currentHeight = listHeight[i]
        let nextHeight = listHeight[i + 1]
        if (-newY >= currentHeight && -newY < nextHeight) {
          this.currentIndex = i
          this.diff = nextHeight + newY
          return
        }
      }
      // 滚动到底部
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) { // 当fixedTop = 0
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${this.fixedTop}px, 0)`
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import "~common/stylus/variable"

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center // 在交叉轴上各个item的对齐方式
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
