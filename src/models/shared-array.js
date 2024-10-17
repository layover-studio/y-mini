import * as Y from 'yjs';

class SharedArray extends Y.Array {
    constructor(){
        super()

        return new Proxy(this, {
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

    static from (yarray) {
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
}

export default SharedArray