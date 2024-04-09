import { v4 as uuidv4 } from "uuid";

import * as DB from "./db.js";
import * as EncryptService from "./encrypt.js";

import User from "../models/user.js";
import Session from "../models/session.js";

export function isLoggedIn() {
  let session = localStorage.getItem('session');

  // console.log(session)

  if(!session){
    return false
  }

  session = JSON.parse(session);

  return session
}

export function getUser(){
  let session = localStorage.getItem('session');
  session = JSON.parse(session);
  return session.user
}

export async function create({ email, password, org }) {
	
	const uid = uuidv4();
	const hashedPassword = await EncryptService.hash(password);
	
	const user = new User({
		uid,
		email,
		password: hashedPassword,
	});

	let db = await DB.open("db/users");
	await db.put(user.uid, user);

	const organization = org ? org : uuidv4()

	user.organizations = [organization]

	await db.put(user.uid, user);
	await db.close();

	return user
}

export async function findOneByEmail(email) {
	const db = await DB.open("db/users");

	for await (const user of db.values()) {
		if (user.email == email) {
			await db.close();

			return new User(user);
		}
	}

	await db.close();

	return false;
}

export async function checkPassword({ user, password }) {
	const hashedPassword = await EncryptService.hash(password);

	return hashedPassword == user.password;
}

export async function createSession({ user }) {
	const uid = uuidv4();
	
	const session = new Session({
		uid,
		user,
		expires: Date.now() + 1000 * 60 * 60 * 24,
	});
	
	const db = await DB.open("db/sessions");
	await db.put(session.uid, session);
	await db.close();

	return session;
}

export async function findSession(sessionId) {
	const db = await DB.open("db/sessions");

	const session = await db.get(sessionId);

	await db.close();

	return new Session(session);
}

export async function removeSession({ session }) {
	const db = await DB.open("db/sessions");

	await db.del(session.uid);

	await db.close();

	return { ok: true };
}
