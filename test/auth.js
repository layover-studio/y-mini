import test from "node:test"
import assert from "node:assert"
import jwt from "jsonwebtoken"

import LaybackServer from "../src/server/index.js"

// [X] signup, login, logout
// [ ] authorization (create role, create JWT claim, sign JWT, check JWT, organization)

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

test("jwt", async () => {
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    var decoded = jwt.verify(token, 'shhhhh');
    assert(decoded.foo == 'bar')
})

test("acl", async () => {
    const access_list = {
        "user1": "ADMIN",
        "user2": "USER",
        "user3": "ANONYMOUS",
        "user4": "OWNER",
    }

    const acl = jwt.sign(access_list, 'shhhhh');

    assert(jwt.verify(acl, 'shhhhh'))
})