import UserGroup from "../models/user-group.js"

import db from "./db.js"

export async function create (args) {
    const res = await db().prepare(`
        INSERT INTO docs 
        (uuid, type, state) 
        VALUES 
        (?, ?, ?);
    `)
    .bind(
        args.uuid, 
        'USER_GROUP',
        args.state
    )
    .run()

    // TODO: generate key pair + sign data property

    // const keyPair = await CryptoService.create({
    //     user: existingUser
    // })

    return findOne(args.uuid)
}

export async function findOne (uid) {
    const res = await db().prepare(`
        SELECT * FROM docs WHERE uuid = ? LIMIT 1;
    `)
    .bind(uid)
    .first()

    if(!res){
        return false
    }

    const doc = new UserGroup()
    doc.import(Buffer.from(res.state))

	return doc;
}

export function update (group) {
    return db().prepare(`
        UPDATE docs
        SET 
        state = ?
        WHERE uuid = ?;
    `)
    .bind(
        group.state,
        group.uuid
    )
    .run()
}

export async function upsert (g) {
    const res = await findOne(g.uuid)

    if(res) {
        return update(g)
    }

    return create(g)
}

export function remove (user) {
    return db().prepare(`
        DELETE FROM docs WHERE uuid = ?;
    `)
    .bind(user.uuid)
    .run()
}