<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import createSong from 'common/js/song'
import MusicList from '../music-list/musicList'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this._normalizeSongs(res.data.list).then((ret) => {
            this.songs = ret
          })
        }
      })
    },
    _normalizeSongs (list) {
      return new Promise((resolve) => {
        let counter = 0
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            createSong(musicData).then((song) => {
              ret.push(song)
              counter++
              if (counter === list.length) {
                resolve(ret)
              }
            })
          }
        })
      })
    }
  },
  created () {
    this._getDetail()
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
@import '~common/stylus/variable.styl'

.slide-enter-active, .slide-leave-active
  transition: all 300ms
.slide-enter, .slide-leave-to // 一个是进入开始的位置，另一个是离开结束的位置
  transform: translate3d(100%, 0, 0)
</style>
