
const fs = require('fs')
const Config = require('../config')
const GitScript = require('../script')
const moment = require('moment')
const stringRandom = require('string-random');
const exec = require('child_process').exec;

class Writer {

  readFile(path){
    return fs.readFileSync(path, 'utf8');
  }
  
  writeFile(path, str){
    fs.writeFileSync(path, str, 'utf8');
  }
  
  sleep(time){
    return new Promise(resolve => {
      setTimeout(()=>{resolve()}, time)
    })
  }
  
  async runDev(cmdStr){
  
    return new Promise(resolve => {
      exec(cmdStr, function(err, stdout, stderr){
        resolve({
          err,
          data: stdout
        })
      });
    })
  
  }
  
  async changeCat(cat, reback, dataTime, today){
    // 首先读取&修改cat文件
    let catStr = this.readFile(cat)
    let myObj = null
    
    
  
    try {
      myObj = JSON.parse(catStr)
    } catch (e) {
      reback.msg = 'parse error'
      reback.error.push(e)
    }
  
    if(!myObj) {
      return reback
    }
  
    myObj.now = dataTime
    myObj.works++
    
    if(myObj.today != today) {
      myObj.today = today
      myObj.days++
    }
  
    myObj.random = stringRandom(10)
  
    this.writeFile(cat, JSON.stringify(myObj, null, 4))
    
    return myObj
  }
  
  async commitGit(reback, today){
    let gitAdd = await this.runDev(GitScript.git.add())
    gitAdd.err && reback.error.push(gitAdd.err)
  
    let gitCommit = await this.runDev(GitScript.git.commit(today))
    gitCommit.err && reback.error.push(gitCommit.err)
  
    let gitPush = await this.runDev(GitScript.git.push())
    gitPush.err && reback.error.push(gitPush.err)
  }
  
  async changeReadme(cat, reback, catJSON){
    // 首先读取&修改cat文件
    let catStr = this.readFile(cat)
  
    catStr = catStr.replace(/\$WORKS\{.*?\}/, `$WORKS{${catJSON.works}}`);
    catStr = catStr.replace(/\$DAYS\{.*?\}/, `$DAYS{${catJSON.days}}`);
    catStr = catStr.replace(/\$NOW\{.*?\}/, `$NOW{${catJSON.now}}`);
    
    // 写文件
    this.writeFile(cat, catStr)
    
  }
  
  async run(){
    let cat = './cat.json'
    let readme = './README.md'
    let reback = {
      msg: '',
      error: []
    }
    let today = moment().format('YYYY-MM-DD HH:mm:ss')
    let day = moment().format('YYYY-MM-DD')
    
    // 首先从远程pull 一下
    let gitPull = await this.runDev(GitScript.git.pull())
    gitPull.err && reback.error.push(gitPull.err)
    
    // pull完之后休息1秒
    await this.sleep(1000)
    
    // 更新CAT
    let catJSON = await this.changeCat(cat, reback, today, day)
  
    // 更细修改README.MD
    await this.changeReadme(readme, reback, catJSON)
    
    
    // 提交GIT
    await this.commitGit(reback, today)
    
    return reback
  }

}

module.exports = Writer
