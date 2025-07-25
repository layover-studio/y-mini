import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { setup, destroy } from "../../utils-client.js"
import { getCollection } from "../../../src/client/services/collection.js"
import SharedDoc from '../../../src/client/models/shared-doc.js'

let doc = false

before(async () => {
    // await setup()
})

test("client - add user", async () => {
    
})

test("client - check access rights", async () => {
    
})

test("client - get user list", async () => {
    
})

test("client - remove user", async () => {
    
})

after(async () => {
    // await destroy()
})