// zod type to ydoc schema https://github.com/colinhacks/zod/discussions/2134
// https://docs.yjs.dev/api/shared-types

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb'
import { z } from "zod";

import { WebsocketProvider } from '../services/y-websocket.js';
import { isLoggedIn } from '../services/auth.js';

class YjsDoc {
    constructor(schema){
        this.schema = schema
        this.doc = new Y.Doc();
        this.isLocalSynced = false
        this.isRemoteSynced = false
        
        const keys = this.keys(schema)
        
        for (const key of keys) {
            
            if(schema.shape[key] instanceof z.ZodArray){
                const yarray = new Y.Array()
                this.doc.getMap('root').set(key, yarray)
            } else {
                this.doc.getMap('root').set(key, null)
            }

            Object.defineProperty(this, key, {
                get() {
                    return this.doc.getMap('root').get(key)
                },
                set(value) {
                    this.doc.getMap('root').set(key, value)
                }
            })

        }
    }

    keys (schema) {
        if (
          schema instanceof z.ZodNullable ||
          schema instanceof z.ZodOptional
        ) {
            return this.keys(schema.unwrap())
        }

        if (schema instanceof z.ZodArray) {
            return this.keys(schema.element)
        }
        
        if (schema instanceof z.ZodObject) {
            const entries = Object.entries(schema.shape)
            
            return entries.flatMap(([key, value]) => {
                const nested = this.keys(value).map(
                    (subKey) => `${key}.${subKey}`
                )
                
                return nested.length ? nested : key
            })
        }
        
        return []
      };

      sync(callback){    
        const idbProvider = new IndexeddbPersistence(this.uid, this.doc)
    
        idbProvider.on('synced', () => {
            this.isLocalSynced = true

            callback()
        })
      }

      connect(callback){
        if(isLoggedIn()) {
            const wsProvider = new WebsocketProvider('ws://localhost:1234', this.uid, this.doc, {
              params: {
                "Authorization": "Bearer 12345"
              }
            })
            wsProvider.shouldConnect = false
      
            wsProvider.on('sync', event => {
                this.isRemoteSynced = true
                callback()
      
                this.doc.getMap('root').observe((e) => {
                    callback()
                });
            })
          }
      }
      
    toJSON(){
        return this.doc.getMap('root').toJSON()
    }

    toString() {
        return JSON.stringify(this.toJSON())
    }
}

export default YjsDoc;