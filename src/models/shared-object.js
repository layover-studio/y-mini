import * as Y from 'yjs';

import SharedArray from './shared-array.js'

import { parseKeys } from "../services/zod.js"

class SharedObject extends Y.Map {
    constructor (schema) {
        super()

        this.schema = schema
        this.props = parseKeys(schema)

        return new Proxy(this, {
            get: function(target, prop, receiver) {
                if(target.props.includes(prop)){
                    const res = target.get(prop)
                    
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
                if(target.props.includes(prop)){
                    // if(target.schema) {
                    //     const { shape } = target.schema
        
                    //     if(!shape[prop] || !shape[prop].safeParse(value).success){
                    //         throw new Error(`Invalid value for property ${prop}`)
                    //     }
                    // }

                    target.set(prop, value)
                    
                    return true
                }

                return Reflect.set(target, prop, value, receiver);
            }
        })
    }

    static from (ymap) {
        return new Proxy(ymap, {
            get: function(target, prop, receiver) {
                if(target.props.includes(prop)){
                    const res = target.get(prop)
                    
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
                if(target.props.includes(prop)){
                    // if(target.schema) {
                    //     const { shape } = target.schema
        
                    //     if(!shape[prop] || !shape[prop].safeParse(value).success){
                    //         throw new Error(`Invalid value for property ${prop}`)
                    //     }
                    // }

                    target.set(prop, value)
                    
                    return true
                }

                return Reflect.set(target, prop, value, receiver);
            }
        }) 
    }
}

// const SharedObject = new Proxy(Y.Map, {
//     construct: function(target, args) {
//         let { map = false, ...keys } = args[0]

//         const ymap = map ? map : new Y.Map()

//         ymap.properties = Object.keys(keys)

//         for(let key of ymap.properties){
//             if(keys[key] instanceof Y.Array){
//                 ymap.set(key, new SharedArray(keys[key]))
//             } else if(keys[key] instanceof Y.Map){
//                 ymap.set(key, new SharedObject({ map: keys[key] }))
//             } else {
//                 ymap.set(key, keys[key])
//             }

//         }
        
//         return new Proxy(ymap, {
//             get: function(target, prop, receiver) {
//                 if(target.properties.includes(prop) || Array.from(ymap.keys()).includes(prop)){
//                     const res = target.get(prop)
//                     if(res instanceof Y.Array){
//                         return new SharedArray(res)
//                     } else if(res instanceof Y.Map){
//                         return new SharedObject({ map: res })
//                     } else {
//                         return res
//                     }
//                 }

//                 return Reflect.get(target, prop, receiver);
//             },
//             set: function(target, prop, value, receiver) {
//                 if(target.properties.includes(prop) || Array.from(ymap.keys()).includes(prop)){
//                     target.set(prop, value)
//                     return true
//                 }

//                 return Reflect.set(target, prop, value, receiver);
//             }
//         }) 
//     }
// }) 

export default SharedObject