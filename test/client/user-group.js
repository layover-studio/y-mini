// import test, { before, after } from 'node:test'
// import assert from 'node:assert'

// import "fake-indexeddb/auto";

// import { User, getCollection, UserGroup } from "../../client.js"

// var uuid = false

// before(async () => {
    
// })

// test("create new organization", async () => {
//     const ug = new UserGroup({
//         name: "test"
//     })

//     assert(ug.name === "test")
// })

// test("save organization", async () => {
//     const ug = new UserGroup({
//         name: "test"
//     })

//     uuid = ug.uuid

//     const res = await ug.save()

//     assert(res)
// })

// test("find organization by uid", async () => {
//     const data = await getCollection('userGroup').where("uuid").equals(uuid).limit(1).first()
//     const org = new UserGroup()
//     org.import(Buffer.from(data.state))

//     assert(org.uuid == uuid)
// })

// // test("add scenes", async () => {
// //     const organization = new UserGroup({
// //         name: "test"
// //     })

// //     assert(organization.scenes.length == 0)
    
// //     organization.addScene({ uuid: "test" })
    
// //     assert(organization.scenes.length == 1)
// // })

// // test("remove scenes", async () => {
// //     const organization = new UserGroup({
// //         name: "test"
// //     })

// //     assert(organization.scenes.length == 0)
    
// //     organization.addScene({ uuid: "test" })
    
// //     assert(organization.scenes.length == 1)
    
// //     organization.removeScene({ uuid: "test" })
    
// //     assert(organization.scenes.length == 0)
// // })

// test("change org name", async () => {    
//     let data = await getCollection('userGroup').where("uuid").equals(uuid).limit(1).first()
//     const organization2 = new UserGroup()
//     organization2.import(Buffer.from(data.state))
    
//     organization2.name = 'test2'
    
//     await organization2.save()

//     assert(organization2.name == 'test2')

//     data = await getCollection('userGroup').where("uuid").equals(uuid).limit(1).first()
//     const organization3 = new UserGroup()
//     organization3.import(Buffer.from(data.state))

//     assert(organization3.name == 'test2')
// })

// test("remove organization", async () => {
//     let data = await getCollection('userGroup').where("uuid").equals(uuid).limit(1).first()
//     const organization = new UserGroup()
//     organization.import(Buffer.from(data.state))

//     await organization.remove()

//     data = await getCollection('userGroup').where("uuid").equals(uuid).limit(1).first()
//     assert(!data)
// })

// after(async () => {
    
// })