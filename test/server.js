import test from "node:test"
import assert from "node:assert"

import LaybackServer from "../src/server/index.js"

// - [ ] Create a server
// - [ ] Extend API
// - [ ] Customize websocket hook

const server = LaybackServer

test("server", async () => {
    const res = await server.request('/test')
    assert(res.status == 200)

    const data = await res.json()
    assert(data.ok)
})