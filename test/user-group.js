import test, { before, after } from 'node:test'
import assert from 'node:assert'
import { Miniflare } from "miniflare";
import { setContext } from "../src/server/context.js"

import * as UserService from "../src/server/services/user.js"
import { UserGroup } from "../server.js"

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
    await UserGroup.createTable()
})

test("create new organization", async () => {
    const ug = new UserGroup({
        name: "test"
    })

    assert(ug.name === "test")
})

test("save organization", async () => {
    const ug = new UserGroup({
        name: "test"
    })

    uuid = ug.uuid

    const res = await ug.save()

    assert(res)
})

test("find organization by uid", async () => {
    const data = await UserGroup.findOne(uuid)

    const org = new UserGroup()
    org.import(Buffer.from(data.state))

    assert(org.uuid == uuid)
})

test("add scenes", async () => {
    const organization = new UserGroup({
        name: "test"
    })

    assert(organization.scenes.length == 0)
    
    organization.addScene({ uuid: "test" })
    
    assert(organization.scenes.length == 1)
})

test("remove scenes", async () => {
    const organization = new UserGroup({
        name: "test"
    })

    assert(organization.scenes.length == 0)
    
    organization.addScene({ uuid: "test" })
    
    assert(organization.scenes.length == 1)
    
    organization.removeScene({ uuid: "test" })
    
    assert(organization.scenes.length == 0)
})

test("change org name", async () => {    
    let data = await UserGroup.findOne(uuid)
    const organization2 = new UserGroup()
    organization2.import(Buffer.from(data.state))
    
    organization2.name = 'test2'
    
    await organization2.save()

    assert(organization2.name == 'test2')

    data = await UserGroup.findOne(uuid)
    const organization3 = new UserGroup()
    organization3.import(Buffer.from(data.state))

    assert(organization3.name == 'test2')
})

test("remove organization", async () => {
    let data = await UserGroup.findOne(uuid)
    const organization = new UserGroup()
    organization.import(Buffer.from(data.state))

    await organization.remove()

    data = await UserGroup.findOne(uuid)
    assert(!data)
})

after(async () => {
    await mf.dispose();
})