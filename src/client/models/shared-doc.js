import { WebsocketProvider } from "../services/y-websocket.js"

import OpfsPersistence from '../services/opfs-provider.js';

import ParentDoc from "../../models/shared-doc.js"

const SharedDoc = new Proxy(ParentDoc, {
    construct: function(target, args) {
        const res = new target(...args)

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

            return true
        }

        return res
    }
})

export default SharedDoc
