import { Miniflare } from "miniflare";

import { setContext } from "../src/server/context.js"
import { createDatabase } from "../src/server/services/db.js"

let mf = false 

export async function setup(){
    mf = new Miniflare({
        modules: true,
        script: "",
        d1Databases: {
            DB: "8dd54cb3-ea6c-42b2-bef1-7e7889d864cd"
        },
    });

    setContext({
        DB: await mf.getD1Database("DB")
    })

    await createDatabase("./src/server/schema.sql")
}

export async function destroy(){
    await mf.dispose()
    mf = false
}