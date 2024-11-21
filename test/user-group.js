import test, { before, after } from 'node:test'
import assert from 'node:assert'
import { Miniflare } from "miniflare";
import { setContext } from "../src/server/context.js"
import { createDatabase } from "../src/server/services/db.js"

var mf = false

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

    await createDatabase()
})

test('create a new user group', async () => {
    
})

after(async () => {
    await mf.dispose();
})