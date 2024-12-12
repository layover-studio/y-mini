import { v4 as uuid } from 'uuid';

import SharedDoc from "./shared-doc.js"

import { getCollection } from "../../core/services/collection.js"

import * as UserService from "../services/user.js"

class UserServer extends SharedDoc {
    constructor(args){

        super({
            collection: getCollection('user')
        })

        if(args) {
            this.uuid = args.uuid ?? uuid()
            this.email = args.email ?? ''
            this.github_id = args.github_id ?? ''
            this.username = args.username ?? ''
            this.avatar_url = args.avatar_url ?? ''
            this.hasPaid = args.hasPaid ?? ''
        }
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