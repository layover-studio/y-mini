import * as UserGroupService from "../services/user-group.js"

import UG from "../../core/models/user-group.js"

class UserGroup extends UG {
    constructor(args){
        super(args)
    }
    
    async save(){
        const state = await this.export()

        return UserGroupService.upsert({
            ...this.toJSON(),
            state
        })
    }

    remove() {
        return UserGroupService.remove(this)
    }
}

export default UserGroup