import { v4 as uuid } from 'uuid';
import { generateId } from "lucia";

import SharedDoc from "../models/shared-doc.js"

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
            role VARCHAR(255) DEFAULT "USER"
        );
    `)
    .run()
}

export async function create (args) {

    const id = args.id ?? generateId(15)

    const res = await db().prepare(`
        INSERT INTO user 
        (id, uuid, github_id, username, email, avatar_url) 
        VALUES 
        (?, ?, ?, ?, ?, ?);
    `)
    .run(
        id,
        uuid(), 
        args.github_id, 
        args.username,
        args.email, 
        args.avatar_url
    )

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
    .get(id)

    if(!res){
        return false
    }

    const doc = new SharedDoc()
    doc.import(res.state)

	return doc;
}

export async function findOneByGithubId (id) {
    const res = await db().prepare(`
        SELECT * FROM user WHERE github_id = ? LIMIT 1;
    `)
    .get(id)

    if(!res){
        return false
    }

    const doc = new SharedDoc()
    doc.import(res.state)

	return doc;
}

export async function findOneByEmail (id) {
    const res = await db().prepare(`
        SELECT * FROM user WHERE email = ? LIMIT 1;
    `)
    .get(id)

    if(!res){
        return false
    }

    const doc = new SharedDoc()
    doc.import(res.state)

	return doc;
}

export async function findOne (uid) {
    const res = await db().prepare(`
        SELECT * FROM user WHERE uuid = ? LIMIT 1;
    `)
    .get(uid)

    if(!res){
        return false
    }

    const doc = new SharedDoc()
    doc.import(res.state)

	return doc;
}

export function update (user) {
    return db().prepare(`
        UPDATE user
        SET 
        username = ?,
        email = ?,
        avatar_url = ?,
        hasPaid = ?
        WHERE uuid = ?;
    `)
    .run(
        user.username, 
        user.email,
        user.avatar_url,
        user.hasPaid,
        user.uuid
    )
}

export function save (user) {
    const id = user.id

    if(id) {
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