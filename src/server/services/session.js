import db from "./db.js"
import { v4 as uuid } from 'uuid';

import * as UserService from "./user.js"

export async function create (user) {
    const u = await UserService.findOne(user.uuid)

    const id = await db().prepare(`
        SELECT u.id 
        FROM users AS u
        LEFT JOIN users_docs AS ud ON ud.user_id = u.id
        LEFT JOIN docs AS d ON d.id = ud.doc_id
        WHERE d.uuid = ? LIMIT 1;
    `).bind(u.uuid).first('id')

    const uid = uuid()

    const res = await db().prepare(`
        INSERT INTO session 
        (uuid, user_id, expires_at)
        VALUES
        (?, ?, ?)
    `)
    .bind(
        uid,
        id,
        Date.now() + 30 * 24 * 60 * 60 * 1000
    )
    .run()

    return findOne(uid)
}

export async function findOneByUser (user) {
    const u = await UserService.findOne(user.uuid)

    const id = await db().prepare(`
        SELECT u.id 
        FROM users AS u
        LEFT JOIN users_docs AS ud ON ud.user_id = u.id
        LEFT JOIN docs AS d ON d.id = ud.doc_id
        WHERE d.uuid = ? LIMIT 1;    
    `).bind(u.uuid).first('id')

    return db().prepare(`
        SELECT * FROM session WHERE user_id = ? LIMIT 1;
    `)
    .bind(id)
    .first()
}

export function findOne (uuid) {
    return db().prepare(`
        SELECT * FROM session WHERE uuid = ? LIMIT 1;
    `)
    .bind(uuid)
    .first()
}

export async function check(session){
    return session.expires_at > Date.now()
}

export function remove (session) {
    return db().prepare(`
        DELETE FROM session WHERE uuid = ?
    `)
    .bind(session.uuid)
    .run()
}