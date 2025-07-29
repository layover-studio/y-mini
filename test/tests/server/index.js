import test, { before, after } from 'node:test'
import assert from 'node:assert'
import * as Y from "yjs"

import { setup, destroy } from "../../utils-server.js"
// import { getCollection } from "../../../src/server/services/collection.js"
import SharedDoc from '../../../src/server/models/shared-doc.js'

let doc = false
let state = false

before(async () => {
    await setup()
})

test("save document on server", async () => {
    doc = new SharedDoc()

    doc.uuid = "uuid"
    doc.title = "a title"

    const res = await doc.save()

    state = await doc.export()

    assert(res.ok)
})

test("find document on server", async () => {
    const s = await SharedDoc.findOne(doc.uuid)

    const doc2 = new SharedDoc()
    
    doc2.import(s.state)
    
    assert(doc2.title == "a title")
})

test("delete document on server", async () => {
    let res = await doc.delete()

    assert(res.ok)

    const state = await SharedDoc.findOne(doc.uuid)

    const doc2 = new SharedDoc()
    
    doc2.import(state.state)
    
    assert(doc2.isDeleted)
})

after(async () => {
    await destroy()
})