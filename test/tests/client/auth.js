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
    doc = new SharedDoc()
    
    const res = doc.addUser({
        user: "uuid", 
        role: "ROLE"
    })

    assert(res)
})

test("client - check access rights", async () => {
    assert(doc.getUser("uuid").role == "ROLE")
})

test("client - get user list", async () => {
    const users = doc.getUsers()

    assert(users.length == 1 && users[0].isPending)
})

test("client - remove user", async () => {
    const res = doc.removeUser("uuid")
    
    assert(res)

    const users = doc.getUsers()
    
    assert(users.length == 0)
})

after(async () => {
    // await destroy()
})