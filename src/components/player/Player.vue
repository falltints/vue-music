<template>
  <div class="player" v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div class="lyric" v-if="currentLyric">
                <p
                  class="text"
                  :class="{'current': currentLineNum === index}"
                  v-for="(line, index) of currentLyric.lines"
                  ref="lyricLine"
                >{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @changePercent="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdClass">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
      ref="audio"
    ></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import ProgressBar from 'base/progress-bar/progressBar'
import ProgressCircle from 'base/progress-circle/progressCircle'
import Scroll from 'base/scroll/Scroll'
import Lyric from 'lyric-parser'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: 'Player',
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  data () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    cdClass () {
      return this.playing ? 'play' : 'play pause'
    },
    disableClass () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLineNum = 0
        this.playingLyric = ''
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      if (this.mode === playMode.random) {
        let list = shuffle(this.sequenceList)
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      }
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
    },
    error () { // 当出现网络错误或者用户请求的URL不存在时
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (time) {
      time = time | 0
      let minute = (time / 60) | 0
      let second = time % 60
      return `${minute}:${this._pad(second)}`
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    enter (el, done) {
      // 相当于v-enter-active类
      // translate3d: 向下，向右为正
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      // 相当于v-leave-active类
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    middleTouchStart (e) {
      this.touch.initialized = true
      const touches = e.touches[0]
      this.touch.startX = touches.pageX
      this.touch.startY = touches.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initialized) {
        return
      }
      const touches = e.touches[0]
      const deltaX = touches.pageX - this.touch.startX
      const deltaY = touches.pageY - this.touch.startY
      if (Math.abs(deltaX) < Math.abs(deltaY)) { // 认定是纵向移动
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd (e) {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') { // 从右向左滑动
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else { // 从左向右滑动
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const transitionDurationTime = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${transitionDurationTime}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${transitionDurationTime}ms`
    },
    _getPosAndScale () {
      const targetWidth = 40
      const paddingLeft = 20 // 40
      const paddingBottom = 10 // 30
      const width = window.innerWidth * 0.8
      const paddingTop = 80
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft - targetWidth / 2)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom - targetWidth / 2
      return {x, y, scale}
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong () {
      // 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    playing (newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  created () {
    this.touch = {}
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      // margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%

        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0 auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        // cubic-bezier(<x1>,<y1>,<x2>,<y2>) 是控制变化的速度曲线
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
