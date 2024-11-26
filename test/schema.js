import test, { before, after } from 'node:test'
import assert from 'node:assert'
import { z } from "zod"

import { SharedDoc } from "../server.js"

before(async () => {
    
})

test('extend schema', async () => {
    const obj = {
        firstName: "test",
        lastName: "test"
    }

    const schema = z.object({
        firstName: z.string()
    })

    assert(schema.safeParse(obj).success)
    
    const extendedSchema = schema.extend({
        lastName: z.string()
    })

    assert(extendedSchema.safeParse(obj).success)
})

test('set schema', async () => {
    const schema = z.object({
        firstName: z.string()
    })

    const ydoc = new SharedDoc(schema)

    ydoc.doc.getMap('root').set('firstName', 'test')

    assert(ydoc.firstName == 'test')

    ydoc.setSchema(schema.extend({
        lastName: z.string()
    }))

    ydoc.lastName = 'test'

    const res = ydoc.toJSON()

    assert(res.lastName == 'test')    
})

test('check data', async () => {
    const schema = z.object({
        firstName: z.string()
    })

    const ydoc = new SharedDoc(schema)

    ydoc.firstName = 'test'

    assert(ydoc.validate())
    
    const ydoc2 = new SharedDoc(schema)
    
    assert(!ydoc2.validate())
})

after(async () => {
    
})