import { LeveldbPersistence } from 'y-leveldb'
import fs from 'fs'

const connection_pools = {}

export function getConnection(doc_name){
    if (!connection_pools[doc_name]){

        if (!fs.existsSync(`./db/${doc_name}`)){
            fs.mkdirSync(`./db/${doc_name}`, { recursive: true })
        }

        connection_pools[doc_name] = new LeveldbPersistence(`./db/${doc_name}`)
    }

    return connection_pools[doc_name]
}