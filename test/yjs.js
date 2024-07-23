import test from "node:test"
import assert from "node:assert"
import { promises as fs } from "node:fs"

import * as Y from "yjs"

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