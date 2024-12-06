import * as Y from 'yjs';

import SharedObject from "./shared-object.js"

import { parseKeys } from "../services/collection.js"

class SharedArray {
    constructor(schema){
        this.array = new Y.Array()
        this.schema = schema
        this.props = parseKeys(schema)

        return new Proxy(this, {
            get: function(target, prop, receiver) {
                // console.log(prop.toString())
                if(!isNaN(Number(prop.toString()))){
                    const res = target.array.get(prop)
                    
                    if(res instanceof Y.Array){
                        return SharedArray.from(res, target.schema)
                    } else if(res instanceof Y.Map){
                        return SharedObject.from(res, target.schema.element)
                    }
        
                    return res
                }

                return Reflect.get(target, prop, receiver);
            },
            set: function(target, prop, value, receiver) {
                if(!isNaN(Number(prop))){
                    let res = false 
                    
                    if(value instanceof SharedArray){
                        res = value.array
                    }
        
                    if(value instanceof SharedObject){
                        res = value.object
                    }

                    target.array.insert(prop, [res])
                    return true
                }

                return Reflect.set(target, prop, value, receiver);
            }
        })
    }

    static from (yarray, schema) {
        const res = new SharedArray(schema)

        res.array = yarray 

        return res
    }

    push(el) {
        const array = el.map(l => {
            if(l instanceof SharedArray){
                return l.array
            }

            if(l instanceof SharedObject){
                return l.object
            }

            return l
        })

        return this.array.push(array)
    }

    get length () {
        return this.array.length
    }

    map (callback) {
        return this.array.map(callback)
    }

    clone () {
        return this.array.clone()
    }

    delete (index, size) {
        return this.array.delete(index, size)
    }

    toJSON(){
        return this.array.toJSON()
    }

    static fromArray (array, schema) {
        return SharedArray.from(Y.Array.from(array), schema)
    }
}

export default SharedArray