import * as Y from 'yjs';

import SharedArray from './shared-array.js'
import SharedObject from './shared-object.js'

import { parseKeys } from "../services/zod.js"

import { WebsocketProvider } from "../services/y-websocket.js"
import OpfsPersistence from '../services/opfs-provider.js';

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

        res.sync = async function({ remote = false } = {}, callback) {
            const provider = new OpfsPersistence(res.uid, res)

            provider.on('synced', () => {
                callback()

                res.getMap('root').observeDeep((e) => {
                    callback()
                })
            })

            await provider.sync()

            if(remote){
                const wsProvider = new WebsocketProvider(
                    `ws://${import.meta.env.PUBLIC_BACKEND_HOSTNAME}`, res.uid, 
                    res, 
                    {
                        params: {
                        // "Authorization": `Bearer ${session.uid}`
                        }
                    }
                )

                wsProvider.shouldConnect = false
            
                wsProvider.on('sync', event => {
                    callback()
            
                    res.getMap('root').observe((e) => {
                        callback()
                    });
                })
            }
        }

        return res
    }
}) 

export default SharedDoc