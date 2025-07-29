// import test, { before, after } from 'node:test'
// import assert from 'node:assert'

// import { setup, destroy } from "../../utils-server.js"
// import { getCollection } from "../../../src/server/services/collection.js"
// import SharedDoc from '../../../src/server/models/shared-doc.js'

// let doc = false

// before(async () => {
//     await setup()
// })

// test("save document on server", async () => {
//     doc = new SharedDoc()

//     doc.title = "a title"

//     const res = await doc.save()

//     assert(res.ok)
// })

// test("find document on server", async () => {
//     const res = await getCollection("default").findOne(doc.uuid)

//     assert(res.title = "a title")
// })

// test("delete document on server", async () => {
//     let res = await doc.delete()

//     assert(res.ok)

//     res = await getCollection("default").findOne(doc.uuid)

//     assert(res.isDeleted)
// })

// after(async () => {
//     await destroy()
// })