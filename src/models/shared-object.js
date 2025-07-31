import * as Y from 'yjs';

import SharedArray from './shared-array.js'

class SharedObject {
    constructor () {
        this.object = new Y.Map()

        return new Proxy(this, {
            get: function(target, prop, receiver) {
                if(target.props.includes(prop)){
                    const res = target.object.get(prop)
                    
                    if(res instanceof Y.Array){
                        return SharedArray.from(res, target.schema.shape[prop])
                    } else if(res instanceof Y.Map){
                        return SharedObject.from(res, target.schema.shape[prop])
                    }
        
                    return res
                }

                return Reflect.get(target, prop, receiver);
            },
            set: function(target, prop, value, receiver) {
                if(target.props.includes(prop)){
                    if(value instanceof SharedArray){
                        target.object.set(prop, value.array)
                        return true
                    }

                    if(value instanceof SharedObject){
                        target.object.set(prop, value.object)
                        return true
                    }

                    target.object.set(prop, value)
                    return true
                }

                return Reflect.set(target, prop, value, receiver);
            }
        })
    }

    static from (ymap, schema) {
        const res = new SharedObject(schema)

        res.object = ymap 

        return res
    }

    clone () {
        return this.object.clone()
    }

    toJSON(){
        return this.object.toJSON()
    }
}

export default SharedObject