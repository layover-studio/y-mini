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
    
//     await UserService.update({
//         ...u,
//         hasPaid: 1
//     })

//     const updated_user = await UserService.findOneById(paymentSession.user_id)

//     assert(updated_user.hasPaid)
// })

// test("get user payment status", async () => {
    
// })
// // after(async () => {
// //     await destroyDatabase()
// // })