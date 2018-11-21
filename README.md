# little-green-hat
如果你有一台闲置的云主机或者vps或者你的电脑永远都不关机(滑稽)，小绿帽可以帮助你每天定时向你的github提交代码，让你每天都被绿。  

![4d112dbd](https://user-images.githubusercontent.com/17584565/45829286-2f53d000-bd2d-11e8-8de9-0f605723662e.gif)

## status

这个状态是动态每天更新的，每次更新之前都会自动pull。

<table>
  <tr>
    <td>执行次数</td>
    <td>工作天数</td>
    <td>上次更新时间</td>
  </tr>  
  <tr>
    <td>$WORKS{75}</td>
    <td>$DAYS{61}</td>
    <td>$NOW{2018-11-22 01:01:30}</td>
  </tr> 
</table>  


## install

* fork本项目
* `git clone [fork后的路径]`
* `cd little-green-hat`
* `npm i`

## 运行前配置

### 1.git免密登陆
由于本程序需要使用到git，fork之后你要对本项目走一遍免密pull or push
* 在命令行输入命令: `git config --global credential.helper store`
* 随便更改下文件进行一次commit&push，git就会记住你的账号密码

### 2.pm2
更改 `/pm2.json` 的`cwd`路径
```js
{
  "apps": [{
    "name": "little-green-hat",
    "script": "index.js",
    "cwd": "D:\workspace2\little-green-hat", // 改成你本地的路径
    "exec_mode": "fork",
    "max_memory_restart": "1G",
    "autorestart": true,
    "node_args": [],
    "args": [],
    "env": {

    }
  }]
}
```
### 3.重置配置
由于本地的运行历史是由程序动态更新的，请重置你的历史。
拷贝 `cat.default.json` 覆盖 `cat.json`

### 运行
* `pm2`是一个守护你的nodejs程序让你的程序在后台运行的好工具，确保你已经安装了`pm2` `npm i -g pm2`
* `pm2 start pm2.json`

## config

`/config/index.js`
```js
  module.exports = {
    mode: 'more', // few | more  //每天运行的频率，高或者低
    rule: {
      few: '30 1 1 * * *', // 每天的凌晨1点1分30秒触发 == 1次
      more: '30 1 * * * *' // 每小时的1分30秒触发 == 24 次
    }
  }
```
* 如果需要更多自定义时间规则见 https://github.com/node-schedule/node-schedule
