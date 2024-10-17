import test from "node:test"
import assert from "node:assert"

import { z } from "zod";

import SharedDoc from "../src/models/shared-doc.js"
import SharedObject from "../src/models/shared-object.js"
import SharedArray from "../src/models/shared-array.js"

test("create shared array", async () => {
    const doc = new SharedDoc(z.object({
        username: z.string(),
        authors: z.array(z.object({
            name: z.string()
        }))
    }))

    const author = new SharedObject(z.object({
        name: z.string()
    }))

    doc.username = "document"
    doc.authors = new SharedArray()

    author.name = "test"

    doc.authors.push([author])

    assert(doc.authors[0].name == "test")
})