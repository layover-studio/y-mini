import Dexie from 'dexie';

export let db_i = false 

export function db(){
    if(!db_i) {
        db_i = new Dexie('devreel');

        // TODO: read schema definition
        db_i.version(1).stores({
            animation: '++uuid, name, organization',
            user: '++uuid',
            userGroup: '++uuid, name'
        });
    }

    return db_i
}

export async function clearDatabase(){
  await db_i.delete()  

  window.location.href = "/login"
}

export default db