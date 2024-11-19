// import test, { before, after } from "node:test"
// import assert from "node:assert"

// import "fake-indexeddb/auto";
// import cookie from "cookie"
// import jwt from "jsonwebtoken"

// import { destroyDatabase } from "../server/src/services/db.js"
// import * as UserService from "../server/src/services/user.js"
// import * as SessionService from "../server/src/services/session.js"
// import * as CryptoService from "../server/src/services/crypto.js"

// import app from "../server/server.js"

// let user = false

// before(async () => {
//     await UserService.createTable()
//     await SessionService.createTable()
//     await CryptoService.createTable()
// });

// test("create key pair", async () => {
//     user = await UserService.create({
//         github_id: "keyPair",
//         username: "keyPair",
//         email: "keyPair",
//         avatar_url: "keyPair"
//     })

//     const keyPair = await CryptoService.create({
//         user
//     })

//     assert(keyPair.user_id == user.id)
// })

// test("sign jwt", async () => {
//     const keyPair = await CryptoService.findOneByUser(user)
//     const token = jwt.sign({ foo: 'bar' }, keyPair.privateKey, { algorithm: 'ES384' });
//     const decoded = jwt.verify(token, keyPair.publicKey, { algorithm: 'ES384' });
//     assert(decoded.foo == 'bar')
// })

// test("remove key pair", async () => {
//     const keyPair = await CryptoService.findOneByUser(user)
//     const res = await CryptoService.remove(keyPair)
//     assert(res)
// })

// test("get public key", async () => {
//     const session = await SessionService.create(user)

//     const keyPair = await CryptoService.create({
//         user
//     })

//     let res = await app.request(`/api/user/public-key`, {
//         method: 'GET',
//         headers: {
//             'Origin': "https://devreel.com",
//             'Cookie': `session=${session.id};httpOnly`
//         }
//     })
//     .then(res => res.json())

//     assert(res.ok)
// })

// test("jwt", async () => {
//     const session = await SessionService.create(user)

//     const keyPair = await CryptoService.create({
//         user
//     })

//     let res = await app.request(`/api/user/jwt`, {
//         method: 'GET',
//         headers: {
//             'Origin': "https://devreel.com",
//             'Cookie': `session=${session.id};httpOnly`
//         }
//     })
//     .then(res => res.json())

//     assert(res.ok)

//     let res2 = await app.request(`/api/user/public-key`, {
//         method: 'GET',
//         headers: {
//             'Origin': "https://devreel.com",
//             'Cookie': `session=${session.id};httpOnly`
//         }
//     })
//     .then(res => res.json())

//     const decoded = jwt.verify(res.jwt, res2.publicKey, { algorithm: 'ES384' });

//     assert(decoded.username == user.username)
// })

// // after(async () => {
// //     await destroyDatabase()
// // })