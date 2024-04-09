import * as Y from 'yjs'
import { ObservableV2 } from 'lib0/observable'
import { debounce } from 'throttle-debounce'

class HttpProvider extends ObservableV2 {
  constructor (path, ydoc) {
    super()

    this.doc = ydoc
    this.path = path

    ydoc.on('update', (update, origin) => {
      if (origin !== this) {
        this.emit('update', [update])
      }
    })
    
    this.on('update', async (update) => {
      Y.applyUpdate(ydoc, update, this)
      await this.storeUpdate()
    })
  }

  async storeUpdate(update){
    return fetch(`${import.meta.env.PUBLIC_BACKEND_URL}/sync/${this.path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: update
    }).then(res => res.arrayBuffer())
  }

  async sync(){
    const update = Y.encodeStateAsUpdate(this.doc)

    const serverUpdate = await this.storeUpdate(update)
    
    Y.applyUpdate(this.doc, new Uint8Array(serverUpdate))

    console.log(this.doc.getMap('root').toJSON())

    this.emit('synced', [this])
  }
  
}

export default HttpProvider