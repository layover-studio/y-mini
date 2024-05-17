import test from "node:test"
import assert from "node:assert"

import LaybackServer from "../src/server/index.js"

const server = LaybackServer

test("signup", async () => {
    const res = await server.request('/signup', {
        method: 'POST',
        body: JSON.stringify({
            email: 'basunako@gmail.com',
            password: 'password'
        })
    })
    assert(res.status == 200)

    const data = await res.json()
    assert(data.ok)
})

let token = false

test("login", async () => {
    const res = await server.request('/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'basunako@gmail.com',
            password: 'password'
        })
    })

    assert(res.status == 200)

    const data = await res.json()
    assert(data.ok)

    token = data.session.uid
})

test("logout", async () => {
    const res = await server.request('/logout', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    assert(res.status == 200)

    const data = await res.json()
    assert(data.ok)
})