const flamelink = require('./flamelink-helper.js')

const init = async () => {
  await flamelink()
  process.exit()
}
init()
