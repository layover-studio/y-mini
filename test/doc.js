import test from "node:test"
import assert from "node:assert"

import SharedDoc from "../src/models/shared-doc.js"

test("doc", async () => {
    const doc = new SharedDoc()

    const res = await doc.sync({}, () => {
        
    })

    assert(res)

    doc.title = "Hello"

    assert(doc.title == "Hello") 
})