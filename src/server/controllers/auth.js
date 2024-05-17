import { Hono } from 'hono'

const app = new Hono()

import * as AuthService from "../../services/auth.js";

app.post('/signup', async ctx => {
    const { email, password, org } = await ctx.req.json()

    const user = await AuthService.create({
        email,
        password,
        org
    })

    return ctx.json({
        ok: true,
        user: { uid: user.uid }
    }, 200)
})

app.post('/login', async ctx => {
    const { email, password } = await ctx.req.json()

    const user = await AuthService.findOneByEmail(email)  
    
    if(!user){
        throw new Error('User not found')
    }
    
    if(!user.checkPassword(password)){
        throw new Error('Invalid password')
    }

    const session = await AuthService.createSession({
        user: {
            uid: user.uid,
            organizations: user.organizations
        }
    })

    return ctx.json({
        ok: true,
        session
    }, 200)
})

app.post('/logout', async ctx => {
    const session = ctx.data.session

    await AuthService.removeSession({
        session
    })

    return ctx.json({
        ok: true
    }, 200)
})

export default app