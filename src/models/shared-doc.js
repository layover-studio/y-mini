import * as Y from 'yjs';

import SharedArray from './shared-array.js'
import SharedObject from './shared-object.js'

import { parseKeys } from "../services/zod.js"

const SharedDoc = new Proxy(Y.Doc, {
    construct: function(target, args) {
        let { schema = false, doc = false, ...params } = args[0]

        const ydoc = doc ? doc : new Y.Doc()

        ydoc.properties = parseKeys(schema)
        
        const res = new Proxy(ydoc, {
            get: function(target, prop, receiver) {
                if(target.properties.includes(prop)){
                    const res = target.getMap("root").get(prop)
                    if(res instanceof Y.Array){
                        return new SharedArray(res)
                    } else if(res instanceof Y.Map){
                        return new SharedObject({ map: res })
                    } else {
                        return res
                    }
                }

                // if(target[prop] instanceof Function){

                // }

                return Reflect.get(target, prop, receiver);
            },
            set: function(target, prop, value, receiver) {
                if(target.properties.includes(prop)){
                    target.getMap("root").set(prop, value)
                    return true
                }

                return Reflect.set(target, prop, value, receiver);
            }
        }) 

        for(let key in params){
            if(params[key] instanceof Y.Array){
                res[key] = new SharedArray(params[key])
            } else if(params[key] instanceof Y.Map){
                res[key] = new SharedObject({ map: params[key] })
            } else {
                res[key] = params[key]
            }
        }

        res.encodeStateAsUpdate = function(){
            return Y.encodeStateAsUpdate(res)
        }

        res.applyUpdate = function(update){
            Y.applyUpdate(res, update)
        }

        return res
    }
}) 

export default SharedDoc