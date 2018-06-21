import originalJsonp from 'jsonp'

// 封装jsonp模块
export default function jsonp (url, data, option) {
  url += ((url.indexOf('?') < 0) ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originalJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (var key in data) {
    let value = data[key] ? data[key] : '' // 有时value会是undefined
    url += `&${key}=${encodeURIComponent(value)}`
  }
  // stringObject.substring(start[required],stop[optional])
  return url ? url.substring(1) : ''
}
