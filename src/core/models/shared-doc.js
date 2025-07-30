import * as Y from 'yjs';
import { z } from "zod";

import { jwtDecode } from "jwt-decode";

import SharedArray from "./shared-array.js"
import SharedObject from "./shared-object.js"
import { getDefaultCollection } from "../services/collection.js"

class SharedDoc {
    constructor({ collection } = {}){        
        // this.schema = schema ?? false
        this.collection = collection ?? getDefaultCollection()

        this.doc = new Y.Doc()

        // this.members
        // this._prelim_acl = new SharedArray(z.array(z.object({
        //     user: z.string(),
        //     role: z.string(),
        //     action: z.string()
        // })))

        return new Proxy(this, {
            get: function(target, prop, receiver) {
                const p = [
                    ...Object.getOwnPropertyNames(SharedDoc.prototype),
                    ...Object.getOwnPropertyNames(target),
                    ...Object.getOwnPropertyNames(Object.getPrototypeOf(target))
                ]

                // if(target.collection.props.includes(prop)){
                if(!p.includes(prop)){
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

                const p = [
                    ...Object.getOwnPropertyNames(SharedDoc.prototype),
                    ...Object.getOwnPropertyNames(target)
                ]
        
                // if(target.collection.props.includes(prop)){
                if(!p.includes(prop)){
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

    getAllProperties(){
        return [
            ...Object.getOwnPropertyNames(SharedDoc.prototype),
            ...Object.getOwnPropertyNames(this)
        ]
    }

    hello(){
        console.log('hello')
    }

    export () {
        return Y.encodeStateAsUpdate(this.doc)
    }

    import (update) {
        Y.applyUpdate(this.doc, update)

        return true
    }

    addUser (args) {
        if(!this._prelim_acl){
            this._prelim_acl = new SharedArray(z.array(z.object({
                user: z.string(),
                role: z.string(),
                action: z.string()
            })))
        }

        this._prelim_acl.push([{ ...args, action: "add" }])

        return true
    }

    removeUser (uuid) {
        let acl = this._prelim_acl

        if(!acl){
            return true
        }

        acl = acl.toJSON()

        
        const index = acl.findIndex(u => u.user == uuid && u.action == "add")

        if(index != -1) {
            this._prelim_acl.delete(index, 1)

            return true
        }

        this._prelim_acl.push([{ user: uuid, action: "remove" }])
        
        return true
    }

    getUsers(){
        let res = []

        if(this.members){
            res = [
                ...res,
                ...jwtDecode(this.members).data
            ]
        }

        if(this._prelim_acl){
            res = [
                ...res,
                ...this._prelim_acl.toJSON()
                .filter(u => u.action == "add")
                .map(u => ({
                    user: u.user,
                    role: u.role,
                    isPending: true
                }))
            ]
        }

        return res
    }

    getUser(uuid){
        const user = this.getUsers().filter(u => u.user == uuid)

        if(user.length == 0) {
            return false
        }

        return user[0]
    }

    transact(callback){
        return this.doc.transact(callback)
    }

    toJSON () {
        return this.doc.getMap('root').toJSON()
    }

    isValid(){
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