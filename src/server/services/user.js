// import { v4 as uuid } from 'uuid';
// import { generateId } from "lucia";

import * as Y from "yjs"

import User from "../models/user.js"

import db from "./db.js"

export async function create (args) {
    const res = await db().prepare(`
        INSERT INTO users 
        (uuid, email) 
        VALUES 
        (?, ?);
    `)
    .bind(
        args.uuid,
        args.email
    )
    .run()

    // TODO: generate key pair + sign data property

    // const keyPair = await CryptoService.create({
    //     user: existingUser
    // })

    return findOne(args.uuid)
}

export async function findOneById (id) {
    const res = await db().prepare(`
        SELECT * FROM users WHERE id = ? LIMIT 1;
    `)
    .bind(id)
    .first()

    if(!res){
        return false
    }

    const doc = new User()
    doc.import(Buffer.from(res.state))

	return doc;
}

export async function findOneByGithubId (id) {
    const res = await db().prepare(`
        SELECT * FROM users WHERE github_id = ? LIMIT 1;
    `)
    .bind(id)
    .first()

    if(!res){
        return false
    }

    const doc = new User()
    doc.import(Buffer.from(res.state))

	return doc;
}

export async function findOneByEmail (id) {
    const res = await db().prepare(`
        SELECT * FROM users WHERE email = ? LIMIT 1;
    `)
    .bind(id)
    .first()

    if(!res){
        return false
    }

    const doc = new User()
    doc.import(Buffer.from(res.state))

	return doc;
}

export async function findOne (uid) {
    const res = await db().prepare(`
        SELECT * FROM users WHERE uuid = ? LIMIT 1;
    `)
    .bind(uid)
    .first()

    if(!res){
        return false
    }

    const doc = new User()
    doc.import(Buffer.from(res.state))

	return doc;
}

export function update (user) {
    return db().prepare(`
        UPDATE users
        SET 
        username = ?,
        email = ?,
        avatar_url = ?,
        state = ?
        WHERE uuid = ?;
    `)
    .bind(
        user.username, 
        user.email,
        user.avatar_url,
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

export function remove (user) {
    return db().prepare(`
        DELETE FROM users WHERE uid = ?;
    `)
    .run(user.uuid)
}