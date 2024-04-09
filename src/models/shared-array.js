import * as Y from 'yjs';

const SharedArray = new Proxy(Y.Array, {
    construct: function(target, args) {
        const yarray = args[0] ? args[0] : new Y.Array()
        
        return new Proxy(yarray, {
            get: function(target, prop, receiver) {
                if(!isNaN(prop)){
                    return target.get(prop);
                }

                return Reflect.get(target, prop, receiver);
            },
            set: function(target, prop, value, receiver) {
                if(!isNaN(prop)){
                    target.insert(prop, [value])
                    return true
                }

                return Reflect.set(target, prop, value, receiver);
            }
        }) 
    }
}) 

export default SharedArray