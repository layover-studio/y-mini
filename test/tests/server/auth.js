import test, { before, after } from 'node:test'
import assert from 'node:assert'

import jwt from "jsonwebtoken"

import { setup, destroy } from "../../utils-server.js"
// import { getCollection } from "../../../src/server/services/collection.js"
import SharedDoc from '../../../src/server/models/shared-doc.js'

import * as CryptoService from "../../../src/server/services/crypto.js"

let doc = false

before(async () => {
    await setup()
})

test("server - add user", async () => {
    doc = new SharedDoc()
    
    const res = doc.addUser({
        user: "uuid", 
        role: "ROLE"
    })

    assert(res)
})

test("server - check access rights", async () => {
    assert(doc.getUser("uuid").role == "ROLE")
})

test("server - get user list", async () => {
    const users = doc.getUsers()
    
    assert(users.length == 1 && users[0].isPending)
})

test("server - remove user", async () => {
    const res = doc.removeUser("uuid")
        
    assert(res)

    const users = doc.getUsers()
    
    assert(users.length == 0)
})

test("server - generate access control list", async () => {
    doc.addUser({
        user: "uuid", 
        role: "ROLE"
    })

    const keyPair = await CryptoService.create({
        doc: {
            uuid: "doc_uuid"
        }
    })

    await doc.buildAcl(keyPair)

    const users = doc.getUsers()
    
    assert(users.length == 1 && !users[0].isPending)
})

after(async () => {
    await destroy()
})