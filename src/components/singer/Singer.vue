<template>
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listView'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  components: {
    ListView
  },
  data () {
    return {
      singers: []
    }
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      /* map的结构：
      map: {
        hot: {
          title: '热门',
          items: [{
            id: '',
            name: '',
            avatar: ''
          },...]
        },
        'A': {
          title: 'A',
          items: [{
            id: '',
            name: '',
            avatar: ''
          },...]
        },
        ...
      }
      */
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
        }

        const key = item.Findex // 字母索引
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
      })

      // 列表有序化
      let hot = []
      let ret = []

      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      ret.sort((a, b) => {
        // charCodeAt()方法可返回指定位置的字符的Unicode编码。这个返回值是0 - 65535之间的整数。
        return a.title.charCodeAt(0) - b.title.charCodeAt(0) // 如果 > 0， 则return true
      })

      return hot.concat(ret) // 最终返回的是一维数组
    }
  },
  created () { // 当切换到此路由时，会触发
    this._getSingerList()
  }
}
</script>

<style lang='stylus' type="text/stylus" scoped>
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
