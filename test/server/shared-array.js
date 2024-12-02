import test from "node:test"
import assert from "node:assert"

import { z } from "zod";

import { SharedDoc, SharedObject, SharedArray, defineCollection } from "../../server.js"

test("create shared array", async () => {

    const doc = new SharedDoc({
        collection: defineCollection({
            name: "test",
            schema: {
                username: z.string(),
                authors: z.array(z.object({
                    name: z.string()
                }))
            }
        })
    })

    const author = new SharedObject(z.object({
        name: z.string()
    }))

    doc.username = "document"
    doc.authors = new SharedArray(z.array(z.object({
        name: z.string()
    })))

    // console.log(new SharedArray())

    author.name = "test"

    // console.log(author)

    doc.authors.push([author])
    
    assert(doc.authors[0].name == "test")
})