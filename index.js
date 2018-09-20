const Writer = require('./lib/writer')
const schedule = require('node-schedule');
const write = new Writer()
const Config = require('./config')

let timeGroup = {
  few: '30 1 1 * * *', // 每天的凌晨1点1分30秒触发 == 1次
  middle: '', // 取消 middle
  more: '30 1 * * * *' // 每小时的1分30秒触发 == 24 次
}

async function index() {
  
  let res = await write.run()
  
  if(res.error.length === 0) {
    console.log('任务执行成功')
  }else{
    console.log('任务执行失败：')
    console.log(res.error)
  
    console.log('尝试再次执行')
    await index()
  }
  
}


function run(){
  schedule.scheduleJob(timeGroup[Config.mode], function(){
    index()
  });
}


run()
