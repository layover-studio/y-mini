
import fs from "node:fs/promises"
import { context } from "../context.js"

// import * as UserService from "./user.js"
// import * as SessionService from "./session.js"
// import * as PaymentService from "./payment.js"
// import SharedDoc from "../models/shared-doc.js"
// import * as CryptoService from "./crypto.js"

export function db () {    
    // return true;
    return context.DB;
}

export function destroyDatabase(){
    return fs.rm(path)
}

export async function createDatabase(script_path){
    const file = await fs.readFile(script_path, 'utf-8')

    return db().prepare(file).run()
}

export default db