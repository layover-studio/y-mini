import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { setup, destroy } from "../../utils-server.js"
import { getCollection } from "../../../src/server/services/collection.js"
import SharedDoc from '../../../src/server/models/shared-doc.js'

let doc = false

before(async () => {
    // await setup()
})

test("server - add user", async () => {
    
})

test("server - generate access control list", async () => {
    
})

test("server - check access rights", async () => {
    
})

test("server - get user list", async () => {
    
})

test("server - remove user", async () => {
    
})

after(async () => {
    // await destroy()
})