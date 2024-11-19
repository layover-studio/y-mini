import { context } from "../context.js"

import * as UserService from "./user.js"
import * as SessionService from "./session.js"
import * as PaymentService from "./payment.js"
// import * as UserGroupService from "./user-group.js"
import * as DocsService from "./docs.js"
import * as CryptoService from "./crypto.js"

export function db () {    
    return context.DB;
}

// export function destroyDatabase(){
//     return fs.rm(path)
// }

export async function createDatabase(){
    await UserService.createTable()
    await SessionService.createTable()
    await PaymentService.createTable()
    // await UserGroupService.createTable()
    await DocsService.createTable()
    await CryptoService.createTable()
}

export default db