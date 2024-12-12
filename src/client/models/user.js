import { v4 as uuid } from 'uuid';

import SharedDoc from "./shared-doc.js"

import { getCollection } from "../../core/services/collection.js"

class User extends SharedDoc {
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
        return SharedDoc.upsert(this)
    }
}

export default User