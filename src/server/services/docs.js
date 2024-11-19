import SharedDoc from "../models/shared-doc.js"

import db from "./db.js";

export function createTable () {
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

export async function create (args) {
    return db()
	.prepare(`
		INSERT INTO ${args.type}s (uuid, state) VALUES (?, ?)
	`)
    .bind(
		args.uuid,
		args.state
	)
	.run();
}

export async function findOne(args){
	const res = await db()
	.prepare(`
		SELECT * FROM ${args.type}s WHERE uuid = ? LIMIT 1
	`)
	.get(args.uuid);

    if(!res){
        return false
    }

    const doc = new SharedDoc()
    doc.import(res.state)

	return doc;
}

export async function update (args) {
    return db()
	.prepare(`
		UPDATE ${args.type}s SET state = ? WHERE uuid = ?
	`)
    .bind(
		args.state,
		args.uuid
	)
	.run();
}