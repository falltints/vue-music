<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item of recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" @load="loadImage">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) of discList" class="item" :key="index"><!--@click="selectItem(item)"-->
              <div class="icon">
                <img width="60px" height="60px" :src="item.imgurl"><!-- v-lazy="item.imgurl"-->
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        <!--<div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>-->
      </div>
    </scroll>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
import {getRecommendation, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/Slider'
import Scroll from 'base/scroll/Scroll'
export default {
  name: 'Recommend',
  components: {
    Slider,
    Scroll
  },
  data () {
    return {
      recommends: [],
      discList: [],
      checkLoaded: false
    }
  },
  methods: {
    _getRecommendation () {
      // 异步过程，会有一定时间的延迟
      getRecommendation().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImage () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  created () {
    this._getRecommendation()
    this._getDiscList()
  }
}
</script>

<style lang='stylus' type="text/stylus" scoped>
@import "~common/stylus/variable"

.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          // flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
          // flex-grow 和 flex-shrink都设为0，即即使有余或空间不足，该项目也不会放大和缩小
          // width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
    /*.loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)*/
</style>
