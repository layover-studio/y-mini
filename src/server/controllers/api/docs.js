import { Hono } from 'hono'

import * as SessionService from "../../services/session.js"
import * as UserService from "../../services/user.js"
import * as CryptoService from "../../services/crypto.js"
// import * as DocsService from "../../services/docs.js"

import SharedDoc from "../../models/shared-doc.js"
import User from "../../models/user.js"

const app = new Hono()

app.post('/diff', async ctx => {
    const { docs } = await ctx.req.json()

    const user = ctx.data.user

    const remote_docs = await SharedDoc.findByUser(user)

    return ctx.json({
        ok: true,
        docs: docs && docs.length > 0 ? remote_docs.filter(x => !docs.includes(x)) : remote_docs
    })
})

app.post('/:uid/update', async ctx => {
    const { type } = await ctx.req.query()
    const uid = ctx.req.param('uid')
    const state = new Uint8Array(await ctx.req.arrayBuffer())

    // TODO: check user has access rights
    // verify jwt and is member

    // const session = ctx.data.session 

    // const user = await UserService.findOneById(session.userId)

    let data = await SharedDoc.findOne(uid)
    
    const res = data.state

    let doc = new SharedDoc()

    if(!data) {
        await SharedDoc.create({
            type,
            uuid: uid,
            state: await doc.export()
        })
    } else {
        doc.import(Buffer.from(data.state))
    }

    const keyPair = await CryptoService.getOneByDoc({ uuid: uid })
    
    await doc.buildAcl(keyPair)
    
    doc.import(state)
    
    await doc.save()

    return ctx.body(doc.export(), 200, {
        'Content-Type': 'application/octet-stream'
    })
})

export default app
