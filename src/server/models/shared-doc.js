import jwt from 'jsonwebtoken'
import { z } from "zod"

import SharedArray from "../../core/models/shared-array.js"
import SD from "../../core/models/shared-doc.js"

class SharedDoc extends SD {
    hasRight(user, role){
        const acl = this.getMap('root').get('members')

        if(!acl) {
            return true
        }
            
        const tmp = jwt.verify(acl, 'secret').data
        
        return tmp.find(el => el.user == user.id && el.role == role)
    }

    buildAcl(user){
        try {
            const acl = this.getMap('root').get('members')
            
            let tmp = acl ? jwt.verify(acl, 'secret').data : [];
            
            const _prelim_acl = this.getMap('root').get('_prelim_acl') ? this.getMap('root').get('_prelim_acl').toJSON() : []
            const size = _prelim_acl.length

            
            for(let i = 0 ; i < size ; i++){
                const access_rule = _prelim_acl[i]
                
                if(this.hasRight(user, "admin")){
                    
                    switch(access_rule.action) {
                        case "add": 
                            tmp.push({
                                user: access_rule.user,
                                role: access_rule.role
                            })
                            break;
                        case "remove":
                            tmp = tmp.filter(el => el.user != access_rule.user)
                            break;
                    }
                }
            }

            
            this.getMap('root').set('_prelim_acl', new SharedArray(z.array(z.object({
                user: z.string(),
                role: z.string(),
                action: z.string()
            }))))   
            
            var new_acl = jwt.sign({data: tmp}, 'secret');

            this.getMap('root').set('members', new_acl)
        } catch (err) {
            console.error(err)
            throw new Error('invalid acl')
        }
    }
}

export default SharedDoc
