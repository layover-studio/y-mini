import * as jwt from 'jose'

import SD from "../../core/models/shared-doc.js"
import { db } from "../services/db.js";

class SharedDoc extends SD {
    async save(){
        return SharedDoc.upsert(this)
    }

    // to get the public key in a usable format
    // let publicKey = await fetch('http://localhost:8787/api/user/public-key', {
    //     credentials: 'include'
    // })
    // .then(res => res.json())
    // .then(res => res.publicKey)
    // .catch(err => false)
    // publicKey = await jose.importSPKI(publicKey, 'ES384')
    async hasRight(user, role, keyPair){
        const acl = this.members
        let tmp = []

        if(!acl) {
            return false
        }

        try {
            const { payload, protectedHeader } = await jwt.jwtVerify(acl, publicKey)
            tmp = payload.data
        } catch (err) {
            return false
        }
        
        return tmp.filter(el => el.user == user.id && el.role == role).length > 0
    }

    remove(){
        return SharedDoc.remove(this)
    }

    // TODO: add to collection method
    // static async findOne(uid){
    //     const res = await db()[doc.collection.schema.name].where("uuid").equals(uid).limit(1).first()

    //     if(!res) {
    //         return false
    //     }

    //     return res.state
    // }

    // static async findAll(){
    //     const res = await db()[doc.collection.schema.name].toArray()
    
    //     return res.map(org => org.state)
    // }
    

    static async upsert (doc) {
        // const indexes = doc.getIndexes()
        const indexes = doc.collection.indexes.split(',').map(i => {
            if(i == '++uuid') return 'uuid'

            return i.replace(/ /g,"")
        })
        let indexed_data = {}
        const data = doc.toJSON()
        
        for(const index of indexes){
            indexed_data[index] = data[index] 
        }

        return db()[doc.collection.name].put({
            ...indexed_data,
            state: doc.export()
        }, doc.uuid)
    }
    
    static remove (doc) {
        // TODO: mark organization doc as deleted
    
        return db()[doc.collection.name].delete(doc.uuid)
    }
}

export default SharedDoc
