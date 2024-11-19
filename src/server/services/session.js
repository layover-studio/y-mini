import db from "./db.js"
import auth from "./auth.js";

export function createTable () {
    return db().prepare(`
        CREATE TABLE IF NOT EXISTS session (
            id TEXT NOT NULL PRIMARY KEY,
            expires_at INTEGER NOT NULL,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user(id)
        );
    `)
    .run()
}

export function create (user) {
    return auth().createSession(user.id, {})
}

export function findOne (id) {
    return db().prepare(`
        SELECT * FROM session WHERE id = ? LIMIT 1;
    `)
    .get(id)
}

export function remove (session) {
    return auth().invalidateSession(session.id)
}