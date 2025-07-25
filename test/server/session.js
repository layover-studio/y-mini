// import test, { before, after } from 'node:test'
// import assert from 'node:assert'
// import { Miniflare } from "miniflare";

// import { setContext } from "../../src/server/context.js"

// import * as SessionService from "../../src/server/services/session.js"
// import * as UserService from "../../src/server/services/user.js"
// import { User } from "../../server.js"
// import { createDatabase } from "../../src/server/services/db.js"

// var mf = false
// var user = false
// var session = false

// before(async () => {
//     mf = new Miniflare({
//         modules: true,
//         script: "",
//         d1Databases: {
//             DB: "8dd54cb3-ea6c-42b2-bef1-7e7889d864cd"
//         },
//     });

//     setContext({
//         DB: await mf.getD1Database("DB")
//     })

//     await createDatabase("./src/server/schema.sql")
// })

// test('create a new session', async () => {
//     user = new User({
//         email: 'test@gmail.com',
//         github_id: 'ok'
//     }) 

//     const res = await user.save()

//     session = await SessionService.create(user)

//     assert(session)
// })

// test('find a session by uid', async () => {
//     const res = await SessionService.findOne(session.uuid)

//     assert(res)
// })

// test('find a session by user', async () => {
//     const res = await SessionService.findOneByUser(user)
//     const res2 = await UserService.findOneById(res.user_id)

//     assert(res && res2.uuid == user.uuid)
// })

// test('check a session', async () => {
//     let res = await SessionService.check(session)

//     assert(res)

//     session.expires_at = new Date("2023-05-02 23:55:55").getTime()

//     res = await SessionService.check(session)

//     assert(!res)
// })

// test('remove a session', async () => {
//     const res = await SessionService.remove(session)

//     assert(res)
// })

// after(async () => {
//     await mf.dispose();
// })