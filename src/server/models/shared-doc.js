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
    
    hasRight(user, role){
        const acl = this.getMap('root').get('members')

        if(!acl) {
            return true
        }
            
        const tmp = jwt.verify(acl, 'secret').data
        
        return tmp.find(el => el.user == user.id && el.role == role)
    }

    buildAcl(user){
        try {
            const acl = this.getMap('root').get('members')
            
            let tmp = acl ? jwt.verify(acl, 'secret').data : [];
            
            const _prelim_acl = this.getMap('root').get('_prelim_acl') ? this.getMap('root').get('_prelim_acl').toJSON() : []
            const size = _prelim_acl.length

            
            for(let i = 0 ; i < size ; i++){
                const access_rule = _prelim_acl[i]
                
                if(this.hasRight(user, "admin")){
                    
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
                }
            }

            
            this.getMap('root').set('_prelim_acl', new SharedArray(z.array(z.object({
                user: z.string(),
                role: z.string(),
                action: z.string()
            }))))   
            
            var new_acl = jwt.sign({data: tmp}, 'secret');

            this.getMap('root').set('members', new_acl)
        } catch (err) {
            console.error(err)
            throw new Error('invalid acl')
        }
    }

    remove(){
        return SharedDoc.remove(this)
    }

    static createTable () {
        return db().prepare(`
            CREATE TABLE IF NOT EXISTS docs (
                id INTEGER PRIMARY KEY,
                uuid VARCHAR(36) UNIQUE,
                type VARCHAR(36),
                state BLOB
            );
        `)
        .run()
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
