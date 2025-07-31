import * as Y from 'yjs';

import SharedArray from "./shared-array.js"
import SharedObject from "./shared-object.js"

class SharedDoc {
    constructor(){        
        this.doc = new Y.Doc()

        return new Proxy(this, {
            get: function(target, prop, receiver) {
                const p = [
                    ...Object.getOwnPropertyNames(SharedDoc.prototype),
                    ...Object.getOwnPropertyNames(target),
                    ...Object.getOwnPropertyNames(Object.getPrototypeOf(target))
                ]

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

                const p = [
                    ...Object.getOwnPropertyNames(SharedDoc.prototype),
                    ...Object.getOwnPropertyNames(target),
                    ...Object.getOwnPropertyNames(Object.getPrototypeOf(target))
                ]
        
                if(!p.includes(prop)){

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

    export () {
        return Y.encodeStateAsUpdate(this.doc)
    }

    import (update) {
        Y.applyUpdate(this.doc, update)

        return true
    }

    transact(callback){
        return this.doc.transact(callback)
    }

    toJSON () {
        return this.doc.getMap('root').toJSON()
    }
}

export default SharedDoc