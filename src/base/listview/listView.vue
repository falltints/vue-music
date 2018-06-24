<template>
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <li v-for="group of data" class="list-group" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item of group.items" class="list-group-item" :key="item.id">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) of shortcutList"
          :key="item"
          class="item"
          :data-index="index"
        >{{ item }}</li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/Scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18

export default {
  name: 'ListView',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    shortcutList () {
      // map方法返回一个新数组
      return this.data.map((group) => {
        return group.title.substr(0, 1) // 只取前一个字符
      })
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      let anchorIndex = parseInt(getData(e.target, 'index')) // 获取到当前index值
      let currentTouch = e.touches[0]
      this.touch.originalY = currentTouch.pageY
      this.touch.originalIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let currentTouch = e.touches[0]
      let currentY = currentTouch.pageY
      let delta = Math.floor((currentY - this.touch.originalY) / ANCHOR_HEIGHT)
      let anchorIndex = this.touch.originalIndex + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo (index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // {Number} time 滚动动画执行的时长（单位 ms）
    }
  },
  created () {
    this.touch = {}
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
/*   .list-fixed
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
    transform: translateY(-50%)*/
</style>
