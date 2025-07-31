import test from 'node:test'
import assert from 'node:assert'

import SharedDoc from '../src/models/shared-doc.js'
import SharedArray from '../src/models/shared-array.js'

test('create new array', () => {
    const doc = new SharedDoc()

    doc.array = new SharedArray()

    doc.array.push([1])

    assert(doc.doc.getMap('root').get('array').get(0) == doc.array[0])
})