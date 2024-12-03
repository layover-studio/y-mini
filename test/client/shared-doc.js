import test from "node:test"
import assert from "node:assert"

import { z } from "zod";

import { SharedDoc, defineCollection } from "../../client.js"

test("create doc", async () => {    
    const doc = new SharedDoc({
        collection: defineCollection({
            name: "test",
            schema: {
                username: z.string(),
            }
        })
    })

    doc.username = "test"

    assert(doc.collection.schema instanceof z.ZodObject)
    assert(doc.collection.props.length == 7)
    assert(doc.username == "test")
})

test("extended class", async () => {
    const collection = defineCollection({
        name: "test",
        schema: {
            username: z.string(),
        }
    })

    class Animation extends SharedDoc {
        constructor () {
            super({ collection })
        }
    }

    const animation = new Animation()

    animation.username = "test"

    assert(animation.username == "test")
})

test("export doc", async () => {
    const doc = new SharedDoc({
        collection: defineCollection({
            name: "test",
            schema: {
                username: z.string(),
            }
        })
    })

    doc.username = "test"

    const state = doc.export()

    assert(state)
})

test("import doc", async () => {
    const doc = new SharedDoc({
        collection: defineCollection({
            name: "test",
            schema: {
                username: z.string(),
            }
        })
    })

    doc.username = "test"

    const state = doc.export()

    const doc2 = new SharedDoc({
        collection: defineCollection({
            name: "test",
            schema: {
                username: z.string(),
            }
        })
    })

    doc2.import(state)

    assert(JSON.stringify(doc2.toJSON()) == JSON.stringify(doc.toJSON()))
})