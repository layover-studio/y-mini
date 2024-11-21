import User from "../../core/models/user.js"

import * as UserService from "../services/user.js"

class UserServer extends User {
    constructor(args){
        super(args)
    }

    async save(){
        const state = await this.export()

        return UserService.upsert({
            ...this.toJSON(),
            state
        })
    }
}

export default UserServer