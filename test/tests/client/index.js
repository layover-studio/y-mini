import test, { before, after } from 'node:test'
import assert from 'node:assert'
import * as z from "zod";

import { setup, destroy } from "../../utils-client.js"
import { defineCollection, getCollection } from "../../../src/client/services/collection.js"
import SharedDoc from '../../../src/client/models/shared-doc.js'

let doc = false
let collection = false

before(async () => {
    collection = defineCollection({
        name: "test",
        schema: {
            title: z.string()
        }
    })

    await setup()
})

test("save document on client", async () => {
    doc = new SharedDoc({
        collection
    })

    doc.uuid = "uuid"
    doc.title = "a title"

    const res = await doc.save()

    assert(res.ok)
})

test("find document on client", async () => {
    const res = await getCollection("test").where("uuid").equals("uuid").first()
    
    const doc2 = new SharedDoc({
        collection
    })
    
    doc2.import(res.state)

    assert(doc2.title == "a title")
})

test("delete document on client", async () => {
    let res = await doc.delete()

    assert(res.ok)

    res = await getCollection("test").where("uuid").equals("uuid").first()

    const doc2 = new SharedDoc({
        collection
    })
    
    doc2.import(res.state)

    assert(doc2.isDeleted)
})

after(async () => {
    await destroy()
})