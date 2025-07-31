import test from 'node:test'
import assert from 'node:assert'

import SharedDoc from '../src/models/shared-doc.js'
import SharedObject from '../src/models/shared-object.js'

test('create new object', () => {
    const doc = new SharedDoc()

    doc.title = new SharedObject()

    doc.title.content = "test"

    assert(JSON.stringify({content:"test"}) === JSON.stringify(doc.doc.getMap('root').get('title').toJSON()))
})