// import test, { before, after } from 'node:test'
// import assert from 'node:assert'
// import { Miniflare } from "miniflare";

// import { setContext } from "../../src/server/context.js"

// import * as PaymentService from "../../src/server/services/payment.js"
// import * as UserService from "../../src/server/services/user.js"
// import { User } from "../../server.js"
// import { createDatabase } from "../../src/server/services/db.js"


// var mf = false
// var user = false
// var session_id = false

// before(async () => {
//     mf = new Miniflare({
//         modules: true,
//         script: "",
//         d1Databases: {
//             DB: "8dd54cb3-ea6c-42b2-bef1-7e7889d864cd"
//         },
//     });

//     setContext({
//         DB: await mf.getD1Database("DB"),
//         STRIPE_SK: process.env.STRIPE_SK,
//         STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID
//     })

//     await createDatabase("./src/server/schema.sql")

//     user = new User({
//         email: 'test@gmail.com',
//         github_id: 'ok'
//     })

//     await user.save()
// })

// test('create payment session', async (t) => {
//     const paymentSession = await PaymentService.create({ user });

//     assert(paymentSession.session_url)
//     assert(paymentSession.session_id)

//     session_id = paymentSession.session_id
// })

// test('update user', async (t) => {
//     const paymentSession = await PaymentService.findOneBySessionId({ session_id });

//     assert(paymentSession)
    
//     const u = await UserService.findOneById(paymentSession.user_id)
    
//     // TODO: sign hasPaid field

//     // await UserService.update({
//     //     ...u,
//     //     hasPaid: 1
//     // })

//     // const updated_user = await UserService.findOneById(paymentSession.user_id)

//     // assert(updated_user.hasPaid)
// })

// after(async () => {
//     await mf.dispose();
// })