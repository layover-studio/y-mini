// // // test("add members", async () => {
// // //     const organization = new Organization({
// // //         name: "test"
// // //     })

// // //     const user = await UserService.create({
// // //         github_id: "ok",
// // //         username: "ok",
// // //         email: "ok",
// // //         avatar_url: "ok"
// // //     }) 

// // //     organization.addMember({
// // //         user: user.id,
// // //         role: "admin"
// // //     })

// // //     let state = await organization.export()

// // //     const session = await SessionService.create(user)

// // //     let res = await app.request(`/api/docs/${organization.uuid}/update?type=organization`, {
// // //         method: 'POST',
// // //         headers: {
// // //             'Origin': "https://devreel.com",
// // //             'Cookie': `session=${session.id};httpOnly`
// // //         },
// // //         body: state
// // //     })
// // //     .then(res => res.arrayBuffer())
// // //     .then(res => new Uint8Array(res))

// // //     assert(res)

// // //     organization.import(res)

// // //     assert(organization.hasRight({ uuid: user.id }, "admin"))

// // //     organization.removeMember(user)

// // //     state = await organization.export()

// // //     res = await app.request(`/api/docs/${organization.uuid}/update?type=organization`, {
// // //         method: 'POST',
// // //         headers: {
// // //             'Origin': "https://devreel.com",
// // //             'Cookie': `session=${session.id};httpOnly`
// // //         },
// // //         body: state
// // //     })
// // //     .then(res => res.arrayBuffer())
// // //     .then(res => new Uint8Array(res))

// // //     organization.import(res)

// // //     assert(organization.getMembers().length == 0)
// // // })

// import test, { before, after } from 'node:test'
// import assert from 'node:assert'
// import { z } from "zod"

// import { Miniflare } from "miniflare";
// import { setContext } from "../../src/server/context.js"
// import jwt from "jsonwebtoken"
// import { createDatabase } from "../../src/server/services/db.js"
// import * as CryptoService from "../../src/server/services/crypto.js"

// import { SharedDoc, defineCollection, User } from "../../server.js"

// var mf = false
// var user = false
// var doc = false
// var keyPair = false

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

//     user = new User({
//         email: 'test@gmail.com'
//     }) 

//     await user.save()
// })

// test('add member', async () => {
//     doc = new SharedDoc({
//         collection: defineCollection({
//             name: 'test',
//             schema: {}
//         })
//     })

//     doc.uuid = 'test'

//     await doc.save()

//     assert(doc.getMembers().length == 0)
    
//     keyPair = await CryptoService.create({
//         doc: {
//             uuid: doc.uuid
//         }
//     })
    
//     doc.addMember({
//         user: user.uuid,
//         role: "USER"
//     })
    
//     assert(doc._prelim_acl.toJSON().length == 1)

//     await doc.buildAcl(keyPair)

//     const members = jwt.verify(doc.members, keyPair.publicKey, { algorithm: 'ES384' }).data

//     assert(members[0].user == user.uuid && members[0].role == "USER")

//     const res = doc.hasRight({ uuid: user.uuid }, "USER", keyPair)
//     assert(res)
    
//     const res2 = doc.hasRight({ uuid: "doesntexist" }, "USER", keyPair)
//     assert(!res2)
// })

// test('remove member', async () => {
    
//     doc.removeMember({
//         uuid: user.uuid
//     })
//     await doc.buildAcl(keyPair)

//     const res = doc.hasRight({ uuid: user.uuid }, "USER", keyPair)
//     assert(!res)
// })

// after(async () => {
//     await mf.dispose();
// })