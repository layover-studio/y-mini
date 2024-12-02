import test from "node:test"
import assert from "node:assert"

import { z } from "zod";

import { SharedDoc, SharedObject, defineCollection } from "../../server.js"

test("create object", async () => {
    const doc = new SharedDoc({
        collection: defineCollection({
            name: "test",
            schema: {
                title: z.string(),
                author: z.object({
                    name: z.string()
                })
            }
        })
    })

    const author = new SharedObject(z.object({
        name: z.string()
    }))

    
    author.name = "bob dylan" 
    
    doc.author = author
    
    doc.title = "test"

    assert(doc.author.name == "bob dylan")
})

test("update object", async () => {
    const doc = new SharedDoc({
        collection: defineCollection({
            name: "test",
            schema: {
                title: z.string(),
                author: z.object({
                    name: z.string()
                })
            }
        })
    })

    const author = new SharedObject(z.object({
        name: z.string()
    }))

    author.name = "bob dylan" 

    doc.author = author
    doc.title = "test"

    assert(doc.author.name == "bob dylan")
    
    doc.author.name = "ok"

    assert(doc.author.name == "ok")
})

test("nested object", async () => {

    const doc = new SharedDoc({
        collection: defineCollection({
            name: "test",
            schema: {
                title: z.string(),
                author: z.object({
                    name: z.string(),
                    org: z.object({
                        name: z.string()
                    })
                })
            }
        })
    })

    const author = new SharedObject(z.object({
        name: z.string(),
        org: z.object({
            name: z.string()
        })
    }))

    const org = new SharedObject(z.object({
        name: z.string()
    }))

    org.name = "yjs"

    author.name = "bob dylan" 
    author.org = org

    doc.title = "test"
    doc.author = author

    doc.author.org.name = "amazon"

    assert(doc.author.org.name == "amazon")
})