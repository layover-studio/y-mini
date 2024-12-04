import * as Y from 'yjs';
import { z } from "zod";

import { jwtDecode } from "jwt-decode";

import SharedArray from "./shared-array.js"
import SharedObject from "./shared-object.js"

class SharedDoc {
    constructor({ collection }){        
        this.collection = collection

        this.doc = new Y.Doc()

        // this.members
        // this._prelim_acl = new SharedArray(z.array(z.object({
        //     user: z.string(),
        //     role: z.string(),
        //     action: z.string()
        // })))

        return new Proxy(this, {
            get: function(target, prop, receiver) {
                if(target.collection.props.includes(prop)){
                    const res = target.doc.getMap("root").get(prop)
                    
                    if(res instanceof Y.Array){
                        return SharedArray.from(res, target.collection.schema.shape[prop])
                    } else if(res instanceof Y.Map){
                        return SharedObject.from(res, target.collection.schema.shape[prop])
                    }
        
                    return res
                }
        
                return Reflect.get(target, prop, receiver);
            },
            set: function(target, prop, value, receiver) {
                // console.log(target.properties, prop)
                // console.log(target.collection)
        
                if(target.collection.props.includes(prop)){
                    // if(target.schema) {
                    //     const { shape } = target.schema

                    //     console.log(prop)
                    //     console.log(shape[prop])
                    //     console.log(shape[prop].safeParse(value))
        
                    //     if(!shape[prop] || !shape[prop].safeParse(value).success){
                    //         throw new Error(`Invalid value for property ${prop}`)
                    //     }
                    // }

                    if(value instanceof SharedArray){
                        target.doc.getMap("root").set(prop, value.array)
                        return true
                    }

                    if(value instanceof SharedObject){
                        target.doc.getMap("root").set(prop, value.object)
                        return true
                    }
                    
                    target.doc.getMap("root").set(prop, value)
                    return true
                }
        
                return Reflect.set(target, prop, value, receiver);
            }
        })
    }

    export () {
        return Y.encodeStateAsUpdate(this.doc)
    }

    import (update) {
        Y.applyUpdate(this.doc, update)

        return true
    }

    addMember (args) {
        if(!this._prelim_acl){
            this._prelim_acl = new SharedArray(z.array(z.object({
                user: z.string(),
                role: z.string(),
                action: z.string()
            })))
        }

        this._prelim_acl.push([{ ...args, action: "add" }])
    }

    removeMember (user) {
        if(!this._prelim_acl){
            return true
        }

        this._prelim_acl.push([{ user: user.id, action: "remove" }])
    }

    // hasRight(user, role){
    //     if(!this.members){
    //         return false
    //     }

    //     const acl = jwtDecode(this.members).data

    //     return acl.find(el => el.user == user.uuid && el.role == role)
    // }

    getMembers(){
        if(!this.members){
            return []
        }

        return jwtDecode(this.members).data
    }

    transact(callback){
        return this.doc.transact(callback)
    }

    toJSON () {
        return this.doc.getMap('root').toJSON()
    }

    validate(){
        return this.collection.schema.safeParse(this.toJSON()).success
    }
}

// const SharedDocProxy = new Proxy(SharedDoc, {
//     get: function(target, prop, receiver) {
//         console.log(target)
//         if(target.props.includes(prop)){
//             const res = target.getMap("root").get(prop)

//             // if(res instanceof Y.Array){
//             //     return new SharedArray(res)
//             // } else if(res instanceof Y.Map){
//             //     return new SharedObject({ map: res })
//             // }

//             return res
//         }

//         return Reflect.get(target, prop, receiver);
//     },
//     set: function(target, prop, value, receiver) {
//         // console.log(target.properties, prop)

//         if(target.props.includes(prop)){
//             if(target.schema) {
//                 const { shape } = target.schema

//                 if(!shape[prop] || !shape[prop].safeParse(value).success){
//                     throw new Error(`Invalid value for property ${prop}`)
//                 }
//             }

//             target.getMap("root").set(prop, value)
//             return true
//         }

//         return Reflect.set(target, prop, value, receiver);
//     }
// })

// export default SharedDocProxy
export default SharedDoc

// import SharedArray from './shared-array.js'
// import SharedObject from './shared-object.js'


// const SharedDoc = new Proxy(Y.Doc, {
//     construct: function(target, args) {
//         if(!args[0]) args[0] = {}
        
//         let { schema = false, doc = false, ...params } = args[0]

//         const ydoc = doc ? doc : new Y.Doc()

//         ydoc.schema = schema
//         ydoc.properties = parseKeys(schema)
        
//         const res = new Proxy(ydoc, {
//             get: function(target, prop, receiver) {
//                 if(target.properties.includes(prop)){
//                     const res = target.getMap("root").get(prop)
//                     if(res instanceof Y.Array){
//                         return new SharedArray(res)
//                     } else if(res instanceof Y.Map){
//                         return new SharedObject({ map: res })
//                     } else {
//                         return res
//                     }
//                 }

//                 // if(target[prop] instanceof Function){

//                 // }

//                 return Reflect.get(target, prop, receiver);
//             },
//             set: function(target, prop, value, receiver) {
//                 // console.log(target.properties, prop)

//                 if(target.properties.includes(prop)){
//                     if(target.schema) {
//                         const { shape } = target.schema
    
//                         if(!shape[prop] || !shape[prop].safeParse(value).success){
//                             throw new Error(`Invalid value for property ${prop}`)
//                         }
//                     }

//                     target.getMap("root").set(prop, value)
//                     return true
//                 }

//                 return Reflect.set(target, prop, value, receiver);
//             }
//         }) 

//         for(let key in params){
//             if(params[key] instanceof Y.Array){
//                 res[key] = new SharedArray(params[key])
//             } else if(params[key] instanceof Y.Map){
//                 res[key] = new SharedObject({ map: params[key] })
//             } else {
//                 res[key] = params[key]
//             }
//         }

//         res.encodeStateAsUpdate = function(){
//             return Y.encodeStateAsUpdate(res)
//         }

//         res.applyUpdate = function(update){
//             Y.applyUpdate(res, update)
//         }

//         return res
//     }
// }) 

// export default SharedDoc