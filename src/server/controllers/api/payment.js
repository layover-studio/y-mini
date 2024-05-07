import { Hono } from 'hono'

const app = new Hono()

// import * as Service from "../services/.js";

app.post('/', async ctx => {
    return ctx.json({
        ok: true
    }, 200)
})

export default app