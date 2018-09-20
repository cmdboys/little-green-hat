module.exports = {
  mode: 'more', // few | more
  rule: {
    few: '30 1 1 * * *', // 每天的凌晨1点1分30秒触发 == 1次
    more: '30 1 * * * *' // 每小时的1分30秒触发 == 24 次
  }
}
