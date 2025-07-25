import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { setup, destroy } from "../utils-server.js"
import { getCollection } from "../../src/server/services/collection.js"
import SharedDoc from '../../src/server/models/shared-doc.js'

let doc = false

before(async () => {
    await setup()
})

test("one-time http sync", async () => {
    const REMOTE_ENDPOINT = `http://localhost:8787/sync/${doc.uuid}`
    await doc.sync(REMOTE_ENDPOINT)
})

test("listen", async () => {
    const REMOTE_ENDPOINT = `http://localhost:8787/listen/${doc.uuid}`
    await doc.listen(REMOTE_ENDPOINT)
})

test("emit", async () => {
    const REMOTE_ENDPOINT = `http://localhost:8787/emit/${doc.uuid}`
    await doc.emit(REMOTE_ENDPOINT)
})

test("open", async () => {
    const REMOTE_ENDPOINT = `http://localhost:8787/open/${doc.uuid}`
    await doc.open(REMOTE_ENDPOINT)
})

after(async () => {
    await destroy()
})