import * as Y from 'yjs';

import SharedArray from "./shared-array.js"
import SharedObject from "./shared-object.js"

import { parseKeys } from "../services/zod.js"

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

    toJSON () {
        return this.getMap('root').toJSON()
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