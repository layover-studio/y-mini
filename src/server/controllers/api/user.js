import { Hono } from 'hono'
import jwt from "jsonwebtoken"

import * as SessionService from "../../services/session.js"
import * as UserService from "../../services/user.js"
import * as CryptoService from "../../services/crypto.js"

const app = new Hono()

app.get('/', async ctx => {
    const user = await UserService.findOneById(ctx.data.session.user_id)

    return ctx.body(
        user.export(), 
        200, {
            'Content-Type': 'application/octet-stream'
        }
    )
})

app.get('/diff', async ctx => {
    const session = ctx.data.session 

    const user = await UserService.findOneById(session.userId)

    return ctx.json({
        ok: true, 
        user 
    })
})

app.get('/public-key', async ctx => {
    const session = ctx.data.session

    const keyPair = await CryptoService.findOneByUser({
        id: session.userId
    })

    if(!keyPair) {
        throw new Error('Key pair not found for this user')
    }

    return ctx.json({
        ok: true, 
        publicKey: keyPair.publicKey
    })
})

app.get('/jwt', async ctx => {
    const session = ctx.data.session

    const user = await UserService.findOneById(session.userId)

    // TODO: should rotate key pair on every call
    const keyPair = await CryptoService.findOneByUser({
        id: session.userId
    })

    if(!keyPair) {
        throw new Error('Key pair not found for this user')
    }

    const token = jwt.sign({ 
        username: user.username,
        avatar_url: user.avatar_url,
        hasPaid: user.hasPaid	
    }, keyPair.privateKey, { algorithm: 'ES384' });

    return ctx.json({
        ok: true, 
        jwt: token
    })
})

export default app
