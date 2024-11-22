import * as UserGroupService from "../services/user-group.js"

import UG from "../../core/models/user-group.js"

class UserGroup extends UG {
    save(){
        return UserGroupService.save(this)
    }

    remove() {
        return UserGroupService.remove(this)
    }
}

export default UserGroup