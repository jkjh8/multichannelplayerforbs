import { app } from 'electron'
import Datastore from 'nedb-promises'

function init(file) {
  return new Datastore({
    filename: `${app.getPath('userData')}/db/${file}`,
    timestampData: true,
    autoload: true
  })
}

export default {
  setup: init('setup'),
  status: init('status')
}
