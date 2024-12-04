import Dexie from 'dexie';

import { collections } from "../../core/services/collection.js"

export let db_i = false 

export function db(){
    if(!db_i) {
        db_i = new Dexie('devreel');

        let stores = {}

        for(const c in collections){
            stores[c] = collections[c].indexes
        }

        db_i.version(1).stores(stores);
    }

    return db_i
}

export async function clearDatabase(){
  await db_i.delete()  

  window.location.href = "/login"
}

export default db