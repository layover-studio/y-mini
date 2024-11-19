import { Hono } from 'hono'

import * as SessionService from "../../services/session.js"
import * as UserService from "../../services/user.js"
import * as DocsService from "../../services/docs.js"

import SharedDoc from "../../models/shared-doc.js"

const app = new Hono()

app.post('/:uid/update', async ctx => {
    const { type } = await ctx.req.query()
    const uid = ctx.req.param('uid')
    const state = new Uint8Array(await ctx.req.arrayBuffer())

    // TODO: check user has access rights
    // verify jwt and is member

    const session = ctx.data.session 

    const user = await UserService.findOneById(session.userId)

    let doc = await DocsService.findOne({
        type,
        uuid: uid
    })

    if(!doc) {
        doc = new SharedDoc()

        await DocsService.create({
            type,
            uuid: uid,
            state: await doc.export()
        })

    } 
    
    doc.import(state)
    
    await doc.buildAcl(user)
    
    const update = await doc.export()
    
    await DocsService.update({
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
