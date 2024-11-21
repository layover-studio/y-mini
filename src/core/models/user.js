import { v4 as uuid } from 'uuid';
import SharedDoc from "./shared-doc.js"
import { UserSchema } from "../schemas.js"

class User extends SharedDoc {
    constructor(args){
        super(UserSchema)

        if(args) {
            this.uuid = args.uuid ?? uuid()
            this.email = args.email ?? ''
            this.github_id = args.github_id ?? ''
            this.username = args.username ?? ''
            this.avatar_url = args.avatar_url ?? ''
        }
    }

}

export default User