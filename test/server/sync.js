import test, { before, after } from 'node:test'
import assert from 'node:assert'
import { Miniflare } from "miniflare";

import "fake-indexeddb/auto";

import { setContext } from "../../src/server/context.js"
import { createDatabase } from "../../src/server/services/db.js"

import { 
    User as UserClient, 
    getCollection as getCollectionClient, 
    listDocs
} from "../../client.js"

import { User as UserServer, SharedDoc } from "../../server.js"

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

    await createDatabase("./src/server/schema.sql")
})

test('get diff', async () => {
    const userClient = new UserClient({
        email: 'test@gmail.com',
        github_id: 'ok'
    }) 

    await userClient.save()

    const userServer = new UserServer({
        email: 'test@gmail.com',
        github_id: 'ok'
    }) 

    await userServer.save()

    const local_docs = await listDocs()

    const remote_docs = await SharedDoc.findByUser(userServer)

    const diff = remote_docs.filter(x => !local_docs.includes(x))

    assert(JSON.stringify(diff) == JSON.stringify(remote_docs))
})

after(async () => {
    await mf.dispose();
})