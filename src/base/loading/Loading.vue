<template>
  <div class="loading">
    <img width="24px" height="24px" src="./loading.gif"><!--img是行内元素-->
    <p class="desc">{{ desc }}</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    desc: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import '~common/stylus/variable.styl'

.loading
  width: 100%
  text-align: center
  .desc
    line-height: 20px
    font-size: $font-size-small
    color: $color-text-l
</style>
