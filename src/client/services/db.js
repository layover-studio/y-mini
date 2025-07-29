import Dexie from 'dexie';

import { collections } from "../../core/services/collection.js"

export let db_i = false 

export function createDatabase(){
    if(!db_i) {
        db_i = new Dexie('layback');

        let stores = {}

        for(const c in collections){
            stores[c] = collections[c].indexes
        }

        db_i.version(1).stores(stores);
    }

    return db_i
}

export function db(){
    return db_i
}

export function clearDatabase(){
    if(db_i){
        return db_i.delete()  
    }

    return false
}