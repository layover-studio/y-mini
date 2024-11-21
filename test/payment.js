// import test, { before, after } from "node:test"
// import assert from "node:assert"

// import { destroyDatabase } from "../server/src/services/db.js"
// import * as UserService from "../server/src/services/user.js"
// import * as SessionService from "../server/src/services/session.js"
// import * as PaymentService from "../server/src/services/payment.js"

// import app from "../server/server.js"

// let user = false
// let session_id = false

// before(async () => {
//     await UserService.createTable()
//     await SessionService.createTable()
//     await PaymentService.createTable()
    
//     user = await UserService.create({
//         github_id: "test", 
//         username: "test",
//         email: "test", 
//         avatar_url: "test"
//     })
// });

import test, { before, after } from 'node:test'
import assert from 'node:assert'
import { Miniflare } from "miniflare";

import { setContext } from "../src/server/context.js"

import { createDatabase } from "../src/server/services/db.js"
import * as SessionService from "../src/server/services/session.js"
import * as PaymentService from "../src/server/services/payment.js"
import * as UserService from "../src/server/services/user.js"

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

test('create payment session', async (t) => {
    const paymentSession = await PaymentService.create({ user });

    assert(paymentSession.session_url)
    assert(paymentSession.session_id)

    session_id = paymentSession.session_id
})

test('update user', async (t) => {
    const paymentSession = await PaymentService.findOneBySessionId({ session_id });

    assert(paymentSession)
    
    const u = await UserService.findOneById(paymentSession.user_id)
    
    // TODO: sign hasPaid field

    // await UserService.update({
    //     ...u,
    //     hasPaid: 1
    // })

    // const updated_user = await UserService.findOneById(paymentSession.user_id)

    // assert(updated_user.hasPaid)
})

after(async () => {
    await mf.dispose();
})