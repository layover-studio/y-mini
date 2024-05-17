import test from "node:test"
import assert from "node:assert"

import SharedDoc from "../src/models/shared-doc.js"

test("doc", async () => {
    const doc = new SharedDoc()

    doc.title = "Hello"

    assert(doc.title == "Hello") 
})