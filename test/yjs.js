import test from "node:test"
import assert from "node:assert"
import { promises as fs } from "node:fs"

import * as Y from "yjs"
import { LeveldbPersistence } from 'y-leveldb'

test("sync", async () => {
    const ydoc1 = new Y.Doc()
    const ydoc2 = new Y.Doc()

    ydoc1.getArray('myarray').insert(0, ['Hello doc2, you got this?'])

    const state1 = Y.encodeStateAsUpdate(ydoc1)
    const state2 = Y.encodeStateAsUpdate(ydoc2)

    Y.applyUpdate(ydoc1, state2)
    Y.applyUpdate(ydoc2, state1)

    assert.strictEqual(ydoc1.getArray('myarray').get(0), ydoc2.getArray('myarray').get(0))
})

test("leveldb", async () => {
    const persistence = new LeveldbPersistence('./storage-location')

    const ydoc = new Y.Doc()
    ydoc.getArray('arr').insert(0, [1, 2, 3])
    ydoc.getArray('arr').toArray() // => [1, 2, 3]

    persistence.storeUpdate('my-doc', Y.encodeStateAsUpdate(ydoc))

    const ydocPersisted = await persistence.getYDoc('my-doc')
    ydocPersisted.getArray('arr') // [1, 2, 3]

    assert(ydocPersisted.getArray('arr').toArray().toString() == ydoc.getArray('arr').toArray().toString())

    await fs.rm('./storage-location', { recursive: true })
})