<template>
  <scroll class="listview" :data="data">
    <ul>
      <li v-for="group of data" class="list-group" :key="group.title">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item of group.items" class="list-group-item" :key="item.id">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touch="onShortcutTouchStart">
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

    }
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
