import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { setup, destroy } from "../../utils-client.js"
import { getCollection } from "../../../src/client/services/collection.js"
import SharedDoc from '../../../src/client/models/shared-doc.js'

let doc = false

before(async () => {
    // await setup()
})

test("client - create new user document", async () => {
    
})

test("client - delete account", async () => {
    
})

after(async () => {
    // await destroy()
})