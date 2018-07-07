function getRandomInt (min, max) { // 返回值为[min, max]
  return Math.floor(Math.random() * (max - min + 1) + min)
  // [0, 1) => [0, max - min + 1) => [min, max + 1)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let index = getRandomInt(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[index]
    _arr[index] = temp
  }
  return _arr
}
