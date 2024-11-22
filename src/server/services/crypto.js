import crypto from 'node:crypto'
import { v4 as uuid } from "uuid"

import db from "./db.js"

export function generateKeyPair () {
    return crypto.subtle.generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-384",
        },
        true,
        ["sign", "verify"],
      );
}

export function createTable () {
    return db().prepare(`
        CREATE TABLE IF NOT EXISTS 
        keyPairs (
            id INTEGER PRIMARY KEY, 
            uuid VARCHAR(36) UNIQUE,
            created_at BIGINT DEFAULT CURRENT_TIMESTAMP,
            updated_at BIGINT DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER NOT NULL,
            publicKey TEXT,
            privateKey TEXT,
            FOREIGN KEY (user_id) REFERENCES user(id)
        );
    `)
    .run()
}

function arrayBufferToBase64(arrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    byteArray.forEach((byte) => {
      byteString += String.fromCharCode(byte);
    });
    return btoa(byteString);
  }
  
  function breakPemIntoMultipleLines(pem) {
    const charsPerLine = 64;
    let pemContents = '';
    while (pem.length > 0) {
      pemContents += `${pem.substring(0, charsPerLine)}\n`;
      pem = pem.substring(64);
    }
    return pemContents;
  }

function toPem(key, type) {
    const pemContents = breakPemIntoMultipleLines(arrayBufferToBase64(key));
    return `-----BEGIN ${type.toUpperCase()} KEY-----\n${pemContents}-----END ${type.toUpperCase()} KEY-----`;
  }

export async function create (args) {
    const keyPair = await generateKeyPair()

    const publicKey = toPem(await crypto.subtle.exportKey("spki", keyPair.publicKey), 'public')
    const privatekey = toPem(await crypto.subtle.exportKey("pkcs8", keyPair.privateKey), 'private')

    const id = await db().prepare(`SELECT id from user WHERE uuid = ? LIMIT 1`).bind(args.user.uuid).first('id') 

    await db()
	.prepare(`
		INSERT INTO keyPairs (uuid, publicKey, privatekey, user_id) VALUES (?, ?, ?, ?)
	`)
    .bind(
		uuid(),
		publicKey,
		privatekey,
		id
	)
	.run();

    return findOneByUser(args.user)
}

export async function findOneByUser(user){
  const id = await db().prepare(`SELECT id from user WHERE uuid = ? LIMIT 1`).bind(user.uuid).first('id') 

    return db()
	.prepare(`
		SELECT * FROM keyPairs WHERE user_id = ? LIMIT 1
	`)
  .bind(id)
	.first();
}

export async function remove (keyPair) {
    const res = await db()
    .prepare(`
      DELETE FROM keyPairs WHERE uuid = ?
    `)
      .bind(
      keyPair.uuid
    )
    .run();

    return res.success
}