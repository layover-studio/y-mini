// import test, { before, after } from 'node:test'
// import assert from 'node:assert'
// import { Miniflare } from "miniflare";

// import "fake-indexeddb/auto";
// import jwt from "jsonwebtoken"

// import { setContext } from "../../src/server/context.js"
// import { createDatabase, db } from "../../src/server/services/db.js"
// import * as CryptoService from "../../src/server/services/crypto.js"

// import { 
//     User as UserClient, 
//     getCollection as getCollectionClient, 
//     listDocs,
//     SharedDoc as ClientDoc,
//     defineCollection
// } from "../../client.js"

// import { 
//     User as UserServer, 
//     SharedDoc, 
//     defineCollection as defineCollectionServer 
// } from "../../server.js"

// var mf = false
// var uuid = false

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

// test('get diff', async () => {
//     const userClient = new UserClient({
//         email: 'test@gmail.com',
//         github_id: 'ok'
//     }) 

//     await userClient.save()

//     const userServer = new UserServer({
//         email: 'test@gmail.com',
//         github_id: 'ok'
//     }) 

//     await userServer.save()

//     const local_docs = await listDocs()

//     const remote_docs = await SharedDoc.findByUser(userServer)

//     const diff = remote_docs.filter(x => !local_docs.includes(x))

//     assert(JSON.stringify(diff) == JSON.stringify(remote_docs))
// })

// test('access control list - add member', async () => {
//     const userServer = new UserServer({
//         email: 'test@gmail.com',
//         github_id: 'ok2'
//     }) 

//     await userServer.save()

//     // client - create new doc
//     const doc = new ClientDoc({
//         collection: defineCollection({
//             name: 'test',
//             schema: {}
//         })
//     })

//     doc.uuid = 'test'
    
//     doc.addMember({
//         user: userServer.uuid,
//         role: "OWNER"
//     })

//     assert(doc._prelim_acl.toJSON().length == 1)
    
//     const state = doc.export()

//     // sync
    
//     const sdoc = new SharedDoc({
//         collection: defineCollectionServer({
//             name: 'test',
//             schema: {}
//         })
//     })
//     sdoc.import(state)
//     await sdoc.save()
    
//     assert(sdoc._prelim_acl.toJSON().length == 1)
    
//     assert(sdoc.uuid == 'test')

//     const keyPair = await CryptoService.getOneByDoc({ uuid: sdoc.uuid })
    
//     await sdoc.buildAcl(keyPair)
    
//     const members = jwt.verify(sdoc.members, keyPair.publicKey, { algorithm: 'ES384' }).data

//     assert(members[0].user == userServer.uuid && members[0].role == "OWNER")

//     const user_id = await db().prepare(`
//         SELECT u.id 
//         FROM users AS u
//         LEFT JOIN users_docs AS ud ON ud.user_id = u.id
//         LEFT JOIN docs AS d ON d.id = ud.doc_id
//         WHERE d.uuid = ? LIMIT 1;
//     `)
//     .bind(
//         userServer.uuid
//     )
//     .first('id')

//     const doc_id = await db().prepare(`
//         SELECT id 
//         FROM docs
//         WHERE uuid = ? LIMIT 1;
//     `)
//     .bind(
//         sdoc.uuid
//     )
//     .first('id')

//     const res = await db().prepare(`
//         SELECT * 
//         FROM users_docs
//         WHERE user_id = ? AND doc_id = ?
//     `)
//     .bind(
//         user_id,
//         doc_id
//     )
//     .first()

//     assert(res)
// })

// test('access control list - remove member', async () => {
    
// })

// after(async () => {
//     await mf.dispose();
// })