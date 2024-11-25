import * as UserGroupService from "../services/user-group.js"

import { v4 as uuid } from 'uuid';
import { z } from "zod";

import { UserGroupSchema } from "../../core/schemas.js";
import SharedDoc from "./shared-doc.js"
import SharedArray from "../../core/models/shared-array.js"

class UserGroup extends SharedDoc {
    constructor (args) {
        super(UserGroupSchema)

        if(args) {
            this.uuid = uuid()
            this.name = args && args.name ? args.name : ''
            this.scenes = new SharedArray(z.array(z.string()))
            this._prelim_acl = new SharedArray(z.array(z.object({
                user: z.string(),
                role: z.string(),
                action: z.string()
            })))
        }

        // this.transitions = new SharedArray()
        // this.size = 0
        // this.duration = 0
    }

    static import (update) {
        const res = new UserGroup()

        res.import(update)

        return res
    }

    addScene (scene) {
        return this.scenes.push([scene.uuid])
    }

    removeScene (scene) {
        const index = this.scenes.toJSON().indexOf(scene.uuid)
        return this.scenes.delete(index, 1)
    }
    
    save(){
        return UserGroupService.save(this)
    }

    remove() {
        return UserGroupService.remove(this)
    }
}

export default UserGroup