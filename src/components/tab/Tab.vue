<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend"><!--router-link默认会被渲染成a标签-->
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Tab'
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import "~common/stylus/variable"
.tab
  display: flex
  height: 44px
  line-height: 44px
  font-size: $font-size-medium
  .tab-item
    flex: 1
    text-align: center
    .tab-link
      padding-bottom: 5px
      color: $color-text-l
    &.router-link-active // router-link标签 选中的时候,会自动给整个标签添加一个router-link-active的class
      .tab-link
        color: $color-theme
        border-bottom: 2px solid $color-theme
</style>
