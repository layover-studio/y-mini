import test from "node:test"
import assert from "node:assert"

import { z } from "zod";

import SharedDoc from "../src/models/shared-doc.js"

test("create doc", async () => {
    const doc = new SharedDoc(z.object({
        username: z.string(),
    }))

    doc.username = "test"

    assert(doc.username == "test")
})

test("export doc", async () => {
    const doc = new SharedDoc(z.object({
        username: z.string(),
    }))

    doc.username = "test"

    const state = doc.export()

    assert(state)
})

test("import doc", async () => {
    const doc = new SharedDoc(z.object({
        username: z.string(),
    }))

    doc.username = "test"

    const state = doc.export()

    const doc2 = new SharedDoc(z.object({
        username: z.string(),
    }))

    doc2.import(state)

    assert(JSON.stringify(doc2.toJSON()) == JSON.stringify(doc.toJSON()))
})