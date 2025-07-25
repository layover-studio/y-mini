import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { setup, destroy } from "../utils-server.js"
import { getCollection } from "../../src/server/services/collection.js"
import SharedDoc from '../../src/server/models/shared-doc.js'

let doc = false

before(async () => {
    await setup()
})

test("awareness", async () => {
    // POC: yjs example
    // MVP: webrtc P2P connection between all connected users
})

after(async () => {
    await destroy()
})