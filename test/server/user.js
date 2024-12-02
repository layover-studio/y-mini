import test, { before, after } from 'node:test'
import assert from 'node:assert'
import { Miniflare } from "miniflare";
import { setContext } from "../../src/server/context.js"
// import { db } from "../src/server/services/db.js"

import { User } from "../../server.js"
import * as UserService from "../../src/server/services/user.js"

var mf = false
var uuid = false

before(async () => {
    mf = new Miniflare({
        modules: true,
        script: "",
        d1Databases: {
            DB: "8dd54cb3-ea6c-42b2-bef1-7e7889d864cd"
        },
    });

    setContext({
        DB: await mf.getD1Database("DB")
    })

    await UserService.createTable()
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
    const user = await UserService.findOne(uuid)

    assert(user.uuid == uuid)
})

test('update user doc', async () => {
    let user = await UserService.findOne(uuid)

    assert(user.email == 'test@gmail.com')

    user.email = 'modified@gmail.com'

    await user.save()

    user = await UserService.findOne(uuid)

    assert(user.email == 'modified@gmail.com')
})

after(async () => {
    await mf.dispose();
})