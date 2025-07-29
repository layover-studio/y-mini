import "fake-indexeddb/auto";

import { createDatabase, clearDatabase } from "../src/client/services/db.js"

let mf = false 

export function setup(){
    return createDatabase()
}

export function destroy(){
    return clearDatabase()
}