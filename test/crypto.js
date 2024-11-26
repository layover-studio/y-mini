import test, { before, after } from "node:test"
import assert from "node:assert"
import { Miniflare } from "miniflare";

import { setContext } from "../src/server/context.js"

// import "fake-indexeddb/auto";
import cookie from "cookie"
import jwt from "jsonwebtoken"

import * as SessionService from "../src/server/services/session.js"
import * as UserService from "../src/server/services/user.js"
import * as CryptoService from "../src/server/services/crypto.js"
import User from "../src/server/models/user.js"

var mf = false
var user = false

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
    await SessionService.createTable()
    await CryptoService.createTable()

    user = new User({
        email: 'test@gmail.com',
        github_id: 'ok'
    })

    await user.save()
});

test("create key pair", async () => {
    const keyPair = await CryptoService.create({
        user
    })

    assert(keyPair)
})

test("sign jwt", async () => {
    const keyPair = await CryptoService.findOneByUser(user)

    const token = jwt.sign({ foo: 'bar' }, keyPair.privateKey, { algorithm: 'ES384' });

    const decoded = jwt.verify(token, keyPair.publicKey, { algorithm: 'ES384' });

    assert(decoded.foo == 'bar')
})

test("remove key pair", async () => {
    const keyPair = await CryptoService.findOneByUser(user)
    const res = await CryptoService.remove(keyPair)

    assert(res)
})

after(async () => {
    await mf.dispose();
})