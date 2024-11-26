// import jwt from 'jsonwebtoken'
// import { z } from "zod"

import SharedArray from "../../core/models/shared-array.js"
import SD from "../../core/models/shared-doc.js"

class SharedDoc extends SD {
    hasRight(user, role){
        // const acl = this.getMap('root').get('members')

        // if(!acl) {
        //     return true
        // }
            
        // const tmp = jwt.verify(acl, 'secret').data
        
        // return tmp.find(el => el.user == user.id && el.role == role)
    }
}

export default SharedDoc
