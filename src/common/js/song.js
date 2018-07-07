import jsonp from './jsonp'
import {commonParams, ERR_OK} from 'api/config'
import {getLyric} from 'api/song'
import {Base64} from 'js-base64'

class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export default function createSong (musicData) {
  return new Promise((resolve) => {
    getSongUrl(musicData.songmid).then((url) => {
      let song = new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: url
      })
      resolve(song)
    })
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}

function getSongUrl (songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  let filename = 'C100' + songmid + '.m4a'

  let data = Object.assign({}, commonParams, {
    loginUin: 11297258,
    hostUin: 0,
    cid: 205361747,
    uin: 11297258,
    g_tk: 872989112,
    platform: 'yqq',
    needNewCode: 0,
    guid: 9136027940,
    filename: filename,
    songmid: songmid,
    format: 'json'
  })

  let options = {
    params: 'callback'
  }

  return new Promise((resolve) => {
    jsonp(url, data, options).then((res) => {
      if (res.code === ERR_OK) {
        let vkey = res.data.items[0].vkey
        let result = `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&fromtag=66`
        resolve(result)
      } else {
        resolve('')
      }
    })
  })
}
