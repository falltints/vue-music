<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'MHeader'
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.m-header
  position: relative
  height: 44px
  text-align: center
  color: $color-theme
  font-size: 0 // 消除inline-block之间的间隙
  .icon
    display: inline-block
    /*vertical-align: top*/
    margin-top: 6px
    width: 30px
    height: 32px
    margin-right: 9px
    bg-image('logo')
    background-size: 30px 32px
  .text
    display: inline-block
    vertical-align: top // 把元素的顶端与行中最高元素的顶端对齐
                        // 默认是baseline：元素放置在父元素的基线上。
    line-height: 44px
    font-size: $font-size-large
  .mine
    position: absolute
    top: 0
    right: 0
    .icon-mine
      display: block
      padding: 12px
      font-size: 20px
      color: $color-theme
</style>
