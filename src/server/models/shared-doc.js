import jwt from 'jsonwebtoken'
import { z } from "zod"

import SharedArray from "../../core/models/shared-array.js"
import SD from "../../core/models/shared-doc.js"
import { db } from "../services/db.js";
import * as CryptoService from "../services/crypto.js";

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
        
        return tmp.filter(el => el.user == user.uuid && el.role == role).length > 0
    }

    async buildAcl (keyPair) {
        if(!this._prelim_acl){
            return;
        }

        try {
            const acl = this.members ?? false
            
            let tmp = acl ? (await CryptoService.verify(keyPair, acl)).data : [];
            
            const _prelim_acl = this._prelim_acl.toJSON()
            const size = _prelim_acl.length

            const doc_id = await db().prepare(`
                SELECT id 
                FROM docs
                WHERE uuid = ? LIMIT 1;
            `)
            .bind(
                this.uuid
            )
            .first('id')
            
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

                const user_id = await db().prepare(`
                    SELECT u.id 
                    FROM users AS u
                    LEFT JOIN users_docs AS ud ON ud.user_id = u.id
                    LEFT JOIN docs AS d ON d.id = ud.doc_id
                    WHERE d.uuid = ? LIMIT 1;
                `)
                .bind(
                    access_rule.user
                )
                .first('id')

                await db()
                .prepare(`
                    INSERT INTO users_docs (user_id, doc_id) VALUES (?, ?)
                `)
                .bind(
                    user_id,
                    doc_id
                )
                .run();
            }

            
            this._prelim_acl = new SharedArray(z.array(z.object({
                user: z.string(),
                role: z.string(),
                action: z.string()
            })))
            
            const new_acl = await CryptoService.sign(keyPair, {data: tmp});

            this.members = new_acl
        } catch (err) {
            console.error(err)
            throw new Error('invalid acl')
        }
    }

    delete(){
        this.isDeleted = 1

        return this.save()
    }

    static async create (args) {

        // TODO: handle signed fields
    
        // TODO: generate key pair + sign data property
    
        // const keyPair = await CryptoService.create({
        //     user: existingUser
        // })
    
        const res = await db()
        .prepare(`
            INSERT INTO docs (uuid, type, isDeleted, state) VALUES (?, ?, ?, ?)
        `)
        .bind(
            args.uuid,
            args.type ?? 'NULL',
            args.isDeleted ?? 0,
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

        res.state = new Uint8Array(res.state)
    
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
            UPDATE docs SET state = ?, isDeleted = ? WHERE uuid = ?
        `)
        .bind(
            args.state,
            args.isDeleted,
            args.uuid
        )
        .run();
    }

    static async upsert (g) {
        const res = await SharedDoc.findOne(g.uuid)
    
        if(res) {
            const data = await SharedDoc.update(g)

            return {
                ok: true,
                ...data
            }
        }

        const data = await SharedDoc.create(g)
    
        return {
            ok: true,
            ...data
        }
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
