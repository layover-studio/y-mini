import jwt from 'jsonwebtoken'
import { z } from "zod"

import SharedArray from "../../core/models/shared-array.js"
import SD from "../../core/models/shared-doc.js"
import { db } from "../services/db.js";

class SharedDoc extends SD {
    async save(){
        const state = await this.export()

        return SharedDoc.upsert({
            ...this.toJSON(),
            state
        })
    }

    hasRight(user, role, keyPair){
        const acl = this.members

        if(!acl) {
            return false
        }
            
        const tmp = jwt.verify(acl, keyPair.publicKey, { algorithm: 'ES384' }).data
        
        return tmp.filter(el => el.user == user.id && el.role == role).length > 0
    }

    buildAcl(keyPair){
        try {
            const acl = this.members ?? false
            
            let tmp = acl ? jwt.verify(acl, keyPair.publicKey, { algorithm: 'ES384' }).data : [];
            
            const _prelim_acl = this._prelim_acl.toJSON()
            const size = _prelim_acl.length

            
            for(let i = 0 ; i < size ; i++){
                const access_rule = _prelim_acl[i]
                
                // if(this.hasRight(user, "admin")){
                    
                    switch(access_rule.action) {
                        case "add": 
                            tmp.push({
                                user: access_rule.user,
                                role: access_rule.role
                            })
                            break;
                        case "remove":
                            tmp = tmp.filter(el => el.user != access_rule.user)
                            break;
                    }
                // }
            }

            
            this._prelim_acl = new SharedArray(z.array(z.object({
                user: z.string(),
                role: z.string(),
                action: z.string()
            })))
            
            const new_acl = jwt.sign({data: tmp}, keyPair.privateKey, { algorithm: 'ES384' });

            // TODO: update users_docs table

            this.members = new_acl
        } catch (err) {
            console.error(err)
            throw new Error('invalid acl')
        }
    }

    remove(){
        return SharedDoc.remove(this)
    }

    static async create (args) {

        // TODO: handle signed fields
    
        // TODO: generate key pair + sign data property
    
        // const keyPair = await CryptoService.create({
        //     user: existingUser
        // })
    
        const res = await db()
        .prepare(`
            INSERT INTO docs (uuid, state) VALUES (?, ?)
        `)
        .bind(
            args.uuid,
            args.state
        )
        .run();
    
        return SharedDoc.findOne(args.uuid)
    }

    static async findOne(uuid){
        const res = await db()
        .prepare(`
            SELECT * FROM docs WHERE uuid = ? LIMIT 1
        `)
        .bind(uuid)
        .first()
    
        if(!res){
            return false
        }
    
        return res;
    }

    static async findByUser(user){
        const user_id = await db()
        .prepare(`
            SELECT u.id 
            FROM docs AS d 
            LEFT JOIN users_docs AS ud ON ud.doc_id = d.id
            LEFT JOIN users AS u ON u.id = ud.user_id 
            WHERE d.uuid = ? 
        `)
        .bind(user.uuid)
        .first('id')
    
        if(!user_id){
            return false
        }

        const res = await db()
        .prepare(`
            SELECT d.uuid 
            FROM docs AS d 
            LEFT JOIN users_docs AS ud ON ud.doc_id = d.id 
            WHERE ud.user_id = ? 
        `)
        .bind(user_id)
        .all()

        if(!res) return false
    
        return res.results.map(r => r.uuid);
    }

    static async update (args) {
        // TODO: handle signed fields
        
        return db()
        .prepare(`
            UPDATE docs SET state = ? WHERE uuid = ?
        `)
        .bind(
            args.state,
            args.uuid
        )
        .run();
    }

    static async upsert (g) {
        const res = await SharedDoc.findOne(g.uuid)
    
        if(res) {
            return SharedDoc.update(g)
        }
    
        return SharedDoc.create(g)
    }
    
    static remove (user) {
        return db().prepare(`
            DELETE FROM docs WHERE uuid = ?;
        `)
        .bind(user.uuid)
        .run()
    }
}

export default SharedDoc
