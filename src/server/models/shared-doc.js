import * as Y from 'yjs';

import jwt from 'jsonwebtoken'

import SharedArray from "../../../src/core/models/shared-array.js"
import SharedObject from "../../../src/core/models/shared-object.js"

import { parseKeys } from "../../../src/core/services/zod.js"

class SharedDoc extends Y.Doc {
    constructor(schema){
        super()
        
        this.schema = schema
        this.props = parseKeys(schema)

        return new Proxy(this, {
            get: function(target, prop, receiver) {
                if(target.props.includes(prop)){
                    const res = target.getMap("root").get(prop)
        
                    if(res instanceof Y.Array){
                        return SharedArray.from(res)
                    } else if(res instanceof Y.Map){
                        return SharedObject.from(res)
                    }
        
                    return res
                }
        
                return Reflect.get(target, prop, receiver);
            },
            set: function(target, prop, value, receiver) {
                // console.log(target.properties, prop)
        
                if(target.props.includes(prop)){
                    // if(target.schema) {
                    //     const { shape } = target.schema

                    //     console.log(prop)
                    //     console.log(shape[prop])
                    //     console.log(shape[prop].safeParse(value))
        
                    //     if(!shape[prop] || !shape[prop].safeParse(value).success){
                    //         throw new Error(`Invalid value for property ${prop}`)
                    //     }
                    // }
        
                    target.getMap("root").set(prop, value)

                    return true
                }
        
                return Reflect.set(target, prop, value, receiver);
            }
        })
    }

    export () {
        return Y.encodeStateAsUpdate(this)
    }

    import (update) {
        Y.applyUpdate(this, update)

        return true
    }

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

            
            this.getMap('root').set('_prelim_acl', new SharedArray())   
            
            var new_acl = jwt.sign({data: tmp}, 'secret');

            this.getMap('root').set('members', new_acl)
        } catch (err) {
            console.error(err)
            throw new Error('invalid acl')
        }
    }

    toJSON () {
        return this.getMap('root').toJSON()
    }
}

export default SharedDoc
