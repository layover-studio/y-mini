import test from "node:test"
import assert from "node:assert"
import { promises as fs } from "node:fs"

import { z } from "zod"

import SharedDoc from "../src/server/models/shared-doc.js"

// [X] Create doc
// [ ] Local sync
// [ ] Remote sync

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test("doc", async () => {
    const doc = new SharedDoc()

    doc.title = "Hello"

    assert(doc.title == "Hello") 
})

test("direct sync", async () => {
    const ydoc1 = new SharedDoc({
        schema: z.object({
            title: z.string()
        })
    })
    const ydoc2 = new SharedDoc()

    ydoc1.title = 'Hello doc2, you got this?'
    
    const state1 = ydoc1.encodeStateAsUpdate()
    ydoc2.applyUpdate(state1)

    assert(ydoc1.getMap('root').get('title') == ydoc2.getMap('root').get('title'))
})

test("local sync", async () => {
    
})