import test from "node:test"
import assert from "node:assert"
import jwt from "jsonwebtoken"

import LaybackServer from "../src/server/index.js"

const server = LaybackServer

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