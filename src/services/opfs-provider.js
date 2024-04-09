import * as Y from 'yjs'
import { ObservableV2 } from 'lib0/observable'
import { debounce } from 'throttle-debounce'

class OpfsProvider extends ObservableV2 {
  constructor (path, ydoc) {
    super()

    this.doc = ydoc
    this.path = path

    ydoc.on('update', debounce(100, (update, origin) => {
      if (origin !== this) {
        this.emit('update', [update])
      }
    }))
    
    this.on('update', debounce(100, async (update) => {
      Y.applyUpdate(ydoc, update, this)
      await this.storeUpdate()
    }))
  }

  async storeUpdate(update){
      const fileHandle = await this.getFileHandle()
      const writable = await fileHandle.createWritable();
      await writable.write(Y.encodeStateAsUpdate(this.doc))
      await writable.close()
  }

  async getFileHandle(){
    const opfsRoot = await navigator.storage.getDirectory();

    const pathParts = this.path.split('/')
    const size = pathParts.length
    let dir = opfsRoot;
    
    for (let i = 0; i < size - 1; i++) {
      const part = pathParts[i]
      dir = await dir.getDirectoryHandle(part, { create: true })
    }

    const fileHandle = await dir.getFileHandle(pathParts[size - 1], { create: true })

    return fileHandle
  }

  async sync(){
    const fileHandle = await this.getFileHandle()
    const f = await fileHandle.getFile()
    const update = new Uint8Array(await f.arrayBuffer())
    
    if(update.length > 0){
      Y.applyUpdate(this.doc, update)
    } else {
      this.storeUpdate()
    }

    this.emit('synced', [this])
  }
  
}

export default OpfsProvider