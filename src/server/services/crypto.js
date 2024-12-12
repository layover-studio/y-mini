import * as jose from 'jose'
import { v4 as uuid } from "uuid"

import db from "./db.js"

export async function create (args) {
  const { publicKey, privateKey } = await jose.generateKeyPair('ES384', {
    extractable: true
  })
  
  const spkiPem = await jose.exportSPKI(publicKey)
  const pkcs8Pem = await jose.exportPKCS8(privateKey)

  // const publicKey = toPem(await crypto.subtle.exportKey("spki", keyPair.publicKey), 'public')
  // const privatekey = toPem(await crypto.subtle.exportKey("pkcs8", keyPair.privateKey), 'private')

    // const id = await db().prepare(`SELECT id from user WHERE uuid = ? LIMIT 1`).bind(args.user.uuid).first('id') 

    await db()
	.prepare(`
		INSERT INTO keyPairs (uuid, publicKey, privatekey, doc) VALUES (?, ?, ?, ?)
	`)
    .bind(
		uuid(),
		spkiPem,
		pkcs8Pem,
		args.doc.uuid
	)
	.run();

    return findOneByDoc(args.doc)
}

export async function findOneByDoc(doc){
    return db()
	.prepare(`
		SELECT * FROM keyPairs WHERE doc = ? LIMIT 1
	`)
  .bind(doc.uuid)
	.first();
}

export async function getOneByDoc(doc) {
  const kp = await findOneByDoc(doc)

  if(!kp) {
    return create({
        doc
    })
  }

  return kp
}

export async function sign(keyPair, data) {
  const alg = 'ES384'

  const privateKey = await jose.importPKCS8(keyPair.privateKey, alg)

  const jwt = await new jose.SignJWT(data)
  .setProtectedHeader({ alg })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .sign(privateKey)

  return jwt
}

export async function verify(keyPair, jwt) {
  const alg = 'ES384'

  const publicKey = await jose.importSPKI(keyPair.publicKey, alg)

  const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
    issuer: 'urn:example:issuer',
    audience: 'urn:example:audience',
  })

  return payload
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