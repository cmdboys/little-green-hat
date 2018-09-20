
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
  
  async run(){
    let cat = './cat.json'
    
    // 首先读取cat文件
    let catStr = this.readFile(cat)
    let myObj = null
    let reback = {
      code: 0,
      msg: '',
      error: []
    }
    let today = moment().format('YYYY-MM-DD HH:mm:ss')
    
    try {
      myObj = JSON.parse(catStr)
    } catch (e) {
      reback.code = 500
      reback.msg = 'parse error'
      reback.error.push(e)
    }
    
    if(!myObj) {
      return reback
    }
  
    myObj.days.push(today)
    
    if(Config.mode === 'few') {
      myObj.random = stringRandom(16)
    }else if(Config.mode === 'middle') {
      myObj.random = stringRandom(300)
    }else if(Config.mode === 'more') {
      myObj.random = stringRandom(1000)
    }
    
    this.writeFile(cat, JSON.stringify(myObj, null, 4))
    
    let gitAdd = await this.runDev(GitScript.git.add())
    gitAdd.err && reback.error.push(gitAdd.err)
  
    let gitCommit = await this.runDev(GitScript.git.commit(today))
    gitCommit.err && reback.error.push(gitCommit.err)
  
    let gitPush = await this.runDev(GitScript.git.push())
    gitPush.err && reback.error.push(gitPush.err)
    
    return reback
    
  }

}

module.exports = Writer
