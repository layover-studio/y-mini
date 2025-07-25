import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { setup, destroy } from "../../utils-server.js"
import { getCollection } from "../../../src/server/services/collection.js"
import SharedDoc from '../../../src/server/models/shared-doc.js'

let doc = false

before(async () => {
    // await setup()
})

test("server - create new user document", async () => {
    
})

test("server - delete account", async () => {
    
})

after(async () => {
    // await destroy()
})