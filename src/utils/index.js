function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function TimeDown (date) {
  // eslint-disable-next-line no-unused-vars
  var h, m, s
  if (date >= 0) {
    h = Math.floor(date / 1000 / 60 / 60)
    m = Math.floor(date / 1000 / 60 % 60)
    s = Math.floor(date / 1000 % 60)

    h = h < 10 ? ('0' + h) : h
    m = m < 10 ? ('0' + m) : m
    s = s < 10 ? ('0' + s) : s
    return h + ':' + m + ':' + s
  }
}

export function getQueryUrl (url, name) {
  var query = url
  var vars = query.split('&')
  var obj = {}
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    obj[pair[0]] = pair[1]
    if (name) {
      // eslint-disable-next-line eqeqeq
      if (pair[0] == name) {
        return pair[1]
      }
    }
  }
  return obj
}
export default {
  formatNumber,
  formatTime,
  TimeDown,
  getQueryUrl
}
