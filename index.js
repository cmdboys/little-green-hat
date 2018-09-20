const Writer = require('./lib/writer')
const schedule = require('node-schedule');
const write = new Writer()
const Config = require('./config')
const moment = require('moment')
// const log = require('./lib/log')

let timeGroup = Config.rule

async function index() {
  
  let now = moment().format('YYYY-MM-DD HH:mm:ss')
  
  let res = await write.run()
  
  if(res.error.length === 0) {
    console.log(now+'> 任务执行成功')
  }else{
    console.log(now+'> 任务执行失败：')
    console.log(res.error)
  
    console.log(now+'> 尝试再次执行')
    await index()
  }
  
}


function run(){
  schedule.scheduleJob(timeGroup[Config.mode], function(){
    index()
  });
}


run()
