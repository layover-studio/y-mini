import db from "./db.js"
import { v4 as uuid } from 'uuid';

import * as UserService from "./user.js"

export function createTable () {
    return db().prepare(`
        CREATE TABLE IF NOT EXISTS session (
            id INTEGER PRIMARY KEY,
            uuid VARCHAR(36) UNIQUE,
            expires_at INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user(id)
        );
    `)
    .run()
}

export async function create (user) {
    const u = await UserService.findOne(user.uuid)

    const id = await db().prepare(`SELECT id FROM user WHERE uuid = ? LIMIT 1`).bind(u.uuid).first('id')

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

    const id = await db().prepare(`SELECT id FROM user WHERE uuid = ? LIMIT 1`).bind(u.uuid).first('id')

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