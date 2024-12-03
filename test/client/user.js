import test, { before, after } from 'node:test'
import assert from 'node:assert'

import "fake-indexeddb/auto";

import { User, getCollection } from "../../client.js"

var mf = false
var uuid = false

before(async () => {

})

test('create a new user', async () => {
    const user = new User({
        email: 'test@gmail.com',
        github_id: 'ok'
    }) 

    const res = await user.save()

    uuid = user.uuid 

    assert(res)
})

test('find a user by id', async () => {
    const data = await getCollection('user').where("uuid").equals(uuid).limit(1).first()
    const user = new User()
    user.import(Buffer.from(data.state))

    assert(user.uuid == uuid)
    assert(user.email == 'test@gmail.com')
})

test('update user doc', async () => {
    let data = await getCollection('user').where("uuid").equals(uuid).limit(1).first()
    let user = new User()
    user.import(Buffer.from(data.state))

    assert(user.email == 'test@gmail.com')

    user.email = 'modified@gmail.com'

    await user.save()

    data = await getCollection('user').where("uuid").equals(uuid).limit(1).first()
    user = new User()
    user.import(Buffer.from(data.state))

    assert(user.email == 'modified@gmail.com')
})

after(async () => {
    
})