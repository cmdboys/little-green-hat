const Writer = require('./lib/writer')

let write = new Writer()
async function index() {
  
  let res = await write.run()
  
  console.log(res)
  
}


index()
