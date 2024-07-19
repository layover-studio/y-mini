import test from "node:test"
import assert from "node:assert"

import SharedDoc from "../src/server/models/shared-doc.js"

// [ ] Create doc
// [ ] Local sync
// [ ] Remote sync

test("doc", async () => {
    const doc = new SharedDoc()

    doc.title = "Hello"

    assert(doc.title == "Hello") 
})