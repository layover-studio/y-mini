import test, { before, after } from 'node:test'
import assert from 'node:assert'
import * as z from "zod";
import * as Y from 'yjs'

import SharedDoc from '../../../src/core/models/shared-doc.js'
import { defineCollection } from "../../../src/core/services/collection.js"

test('create new doc', () => {
    const doc = new SharedDoc()

    const title = "test"

    doc.title = title

    assert(doc.title === title)
    assert(doc.title === doc.doc.getMap('root').get('title'))
})

test('manual sync', () => {
    const doc1 = new SharedDoc()
    const doc2 = new SharedDoc()

    doc1.counter = 1
    doc2.counter = 2

    const update1 = doc1.export()
    const update2 = doc2.export()

    doc1.import(update2)
    doc2.import(update1)

    assert(doc1.counter === doc2.counter)
})

test('extend doc class', () => {
    class CustomDoc extends SharedDoc {
        hello(){
            return 'ok'
        }
    }

    const doc = new CustomDoc()
    
    assert(doc.hello() == 'ok')
})

test('schema validation', () => {
    const collection = defineCollection({
        name: "test",
        schema: {
            title: z.string()
        }
    })

    const doc = new SharedDoc({
        collection
    })

    doc.title = "test"

    assert(doc.isValid())

    doc.title = 1

    assert(!doc.isValid())
})