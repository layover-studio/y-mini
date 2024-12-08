import { collections, listCollections } from "../../core/services/collection.js"
import { db } from "./db.js";

export function getCollection(collectionName){
    return db()[collections[collectionName].name]
}

export async function listDocs(){
    const collections = listCollections()
    const size = collections.length 

    let res = []

    for(let i = 0 ; i < size ; i++) {
        const collection = db()[collections[i]].toCollection()
        const keys = await collection.primaryKeys()
        const keys_size = keys.length 

        for(let j = 0 ; j < keys_size ; j++) {
            res.push(keys[j])
        }
    }

    return res
}