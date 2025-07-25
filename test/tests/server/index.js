import test, { before, after } from 'node:test'
import assert from 'node:assert'

import { setup, destroy } from "../../utils.js"

before(async () => {
    await setup()
})

test(() => {
    console.log("running")
})

after(async () => {
    await destroy()
})