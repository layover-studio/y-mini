import { v4 as uuid } from 'uuid';
import { generateId } from "lucia";

import * as Y from "yjs"

import User from "../models/user.js"

import db from "./db.js"

export function createTable () {
    return db().prepare(`
        CREATE TABLE IF NOT EXISTS user (
            id TEXT NOT NULL PRIMARY KEY,
            uuid VARCHAR(36) UNIQUE,
            github_id VARCHAR(255) UNIQUE,
            username VARCHAR(255),
            email VARCHAR(255),
            avatar_url VARCHAR(255),
            hasPaid BOOLEAN DEFAULT FALSE,
            role VARCHAR(255) DEFAULT "USER",
            state BLOB
        );
    `)
    .run()
}

export async function create (args) {
    
    const id = args.id ?? generateId(15)

    const res = await db().prepare(`
        INSERT INTO user 
        (id, uuid, github_id, username, email, avatar_url, state) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?);
    `)
    .bind(
        id,
        args.uuid, 
        args.github_id, 
        args.username,
        args.email, 
        args.avatar_url,
        args.state
    )
    .run()

    // TODO: generate key pair + sign data property

    // const keyPair = await CryptoService.create({
    //     user: existingUser
    // })

    return findOneById(id)
}

export async function findOneById (id) {
    const res = await db().prepare(`
        SELECT * FROM user WHERE id = ? LIMIT 1;
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
        SELECT * FROM user WHERE github_id = ? LIMIT 1;
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
        SELECT * FROM user WHERE email = ? LIMIT 1;
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
        SELECT * FROM user WHERE uuid = ? LIMIT 1;
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
        UPDATE user
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
        DELETE FROM user WHERE uid = ?;
    `)
    .run(user.uuid)
}