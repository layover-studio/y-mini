import { Hono } from 'hono'

import * as SessionService from "../../services/session.js"
import * as UserService from "../../services/user.js"
// import * as DocsService from "../../services/docs.js"

import SharedDoc from "../../models/shared-doc.js"

const app = new Hono()

app.get('/diff', async ctx => {
    const { docs } = await ctx.req.json()

    const session = ctx.data.session 

    const user = await UserService.findOneById(session.user_id)

    const remote_docs = await SharedDoc.findByUser(user)

    return ctx.json({
        ok: true,
        docs: remote_docs.filter(x => !docs.includes(x))
    })
})

app.post('/:uid/update', async ctx => {
    const { type } = await ctx.req.query()
    const uid = ctx.req.param('uid')
    const state = new Uint8Array(await ctx.req.arrayBuffer())

    // TODO: check user has access rights
    // verify jwt and is member

    const session = ctx.data.session 

    const user = await UserService.findOneById(session.userId)

    let doc = await SharedDoc.findOne({
        type,
        uuid: uid
    })

    if(!doc) {
        doc = new SharedDoc()

        await SharedDoc.create({
            type,
            uuid: uid,
            state: await doc.export()
        })

    } 
    
    doc.import(state)

    const keyPair = await CryptoService.getOneByDoc({ uuid: uid })
    
    await doc.buildAcl(keyPair)
    
    const update = await doc.export()
    
    await SharedDoc.update({
        type,
        uuid: uid,
        state: update
    }) 
    

    // doc = await DocsService.findOne({
    //     type,
    //     uuid: uid
    // })

    // console.log(doc.toJSON())

    return ctx.body(update, 200, {
        'Content-Type': 'application/octet-stream'
    })
})

export default app
