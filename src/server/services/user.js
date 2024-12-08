import { v4 as uid } from 'uuid';

import User from "../models/user.js"

import db from "./db.js"

export async function create (args) {
    const uuid = args.uuid ?? uid()
    
    const user = await db().prepare(`
        INSERT INTO users 
        (uuid, email) 
        VALUES 
        (?, ?);
    `)
    .bind(
        uid(),
        args.email
    )
    .run()

    if(args.github_id){
        await db().prepare(`
            INSERT INTO github_users 
            (github_id, user_id) 
            VALUES 
            (?, ?);
        `)
        .bind(
            args.github_id,
            user.meta.last_row_id
        )
        .run()
    }

    const doc = await db().prepare(`
        INSERT INTO docs 
        (uuid, type, state) 
        VALUES 
        (?, ?, ?);
    `)
    .bind(
        uuid,
        "USER",
        args.state
    )
    .run()

    await db().prepare(`
        INSERT INTO users_docs 
        (user_id, doc_id) 
        VALUES 
        (?, ?);
    `)
    .bind(
        user.meta.last_row_id,
        doc.meta.last_row_id
    )
    .run()

    return findOne(uuid)
}

export async function findOneById (id) {
    const state = await db().prepare(`
        SELECT d.state 
        FROM users_docs AS ud 
        LEFT JOIN docs AS d ON d.id = ud.doc_id   
        WHERE user_id = ? 
        LIMIT 1;
    `)
    .bind(id)
    .first("state")

    if(!state){
        return false
    }

    const doc = new User()
    doc.import(Buffer.from(state))

	return doc;
}

export async function findOneByGithubId (id) {
    const user_id = await db().prepare(`
        SELECT user_id FROM github_users WHERE github_id = ? LIMIT 1;
    `)
    .bind(id)
    .first("user_id")

    if(!user_id){
        return false
    }

	return findOneById(user_id);
}

export async function findOneByEmail (email) {
    const state = await db().prepare(`
        SELECT d.state 
        FROM users AS u
        LEFT JOIN users_docs AS ud ON ud.user_id = u.id
        LEFT JOIN docs AS d ON d.id = ud.doc_id
        WHERE u.email = ? LIMIT 1;
    `)
    .bind(email)
    .first('state')

    if(!state){
        return false
    }

    const doc = new User()
    doc.import(Buffer.from(state))

	return doc;
}

export async function findOne (uid) {
    const state = await db().prepare(`
        SELECT d.state 
        FROM users AS u
        LEFT JOIN users_docs AS ud ON ud.user_id = u.id
        LEFT JOIN docs AS d ON d.id = ud.doc_id
        WHERE d.uuid = ? LIMIT 1;
    `)
    .bind(uid)
    .first('state')

    if(!state){
        return false
    }

    const doc = new User()
    doc.import(Buffer.from(state))

	return doc;
}

export async function findDoc(user){
    const doc = await db().prepare(`
        SELECT * 
        FROM docs
        WHERE uuid = ? LIMIT 1;
    `)
    .bind(user.uuid)
    .first()

    if(!doc) return false 

    return doc
}

export async function update (user) {

    return db().prepare(`
        UPDATE docs
        SET 
        state = ?
        WHERE uuid = ?;
    `)
    .bind(
        user.state,
        user.uuid
    )
    .run()
}

export async function upsert (user) {
    const res = await findOne(user.uuid)

    if(res) {
        return update(user)
    }

    return create(user)
}

export async function remove (user) {
    const u = await db().prepare(`
        SELECT * FROM users WHERE uuid = ?;
    `)
    .bind(user.uuid)
    .first()

    const doc_ids = await db().prepare(`
        SELECT doc_id FROM users_docs WHERE user_id = ?;
    `)
    .bind(u.id)
    .all()

    await db().prepare(`
        DELETE FROM docs WHERE id IN (?);
    `)
    .bind(doc_ids.results.join(', '))
    .run()

    await db().prepare(`
        DELETE FROM users_docs WHERE user_id = ?;
    `)
    .bind(u.id)
    .run()

    return db().prepare(`
        DELETE FROM users WHERE uid = ?;
    `)
    .bind(user.uuid)
    .run()
}