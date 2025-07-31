import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { setup, destroy } from "../utils-server.js"
// import { getCollection } from "../../src/server/services/collection.js"
import SharedDoc from '../../src/server/models/shared-doc.js'

// MOTIVE: SHOULD BE ABLE TO E2E ENCRYPT DOCUMENT FIELDS IN TRANSIT AND BINARY DOCUMENTS AT REST

let doc = false

before(async () => {
    await setup()
})

test("encrypt document field", async () => {
    
})

test("decrypt document field", async () => {
    
})

test("encrypt binary document", async () => {
    
})

test("decrypt binary document", async () => {
    
})

after(async () => {
    await destroy()
})