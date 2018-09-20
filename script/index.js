module.exports = {

  git: {
    add(){
      return 'git add -u'
    },
    commit(msg){
      return `git commit -m "${msg}"`
    },
    push(){
      return `git push origin`
    },
    pull(){
      return `git pull origin`
    }
  }

}
