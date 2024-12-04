import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { SharedDoc, defineCollection } from "../../client.js"

before(async () => {

})

test('add member', async () => {
    const doc = new SharedDoc({
        collection: defineCollection({
            name: 'test',
            schema: {}
        })
    })

    assert(doc.getMembers().length == 0)

    doc.addMember({
        user: "1",
        role: "USER"
    })
    
    assert(doc._prelim_acl.toJSON().length == 1)
})

test('remove member', async () => {
    const doc = new SharedDoc({
        collection: defineCollection({
            name: 'test',
            schema: {}
        })
    })

    doc.addMember({
        user: "1",
        role: "USER"
    })
    
    doc.removeMember({
        id: "1"
    })

    assert(doc._prelim_acl.toJSON().length == 2)
})

after(async () => {
    
})