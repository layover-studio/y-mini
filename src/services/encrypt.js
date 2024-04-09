void !(function () {
	typeof self == "undefined" && typeof global == "object" && (global.self = global);
})();

import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { v4 as uuidv4 } from "uuid";

let masterKey = false

export function generateKey() {
	return crypto.subtle
		.generateKey(
			{
				name: "AES-GCM",
				length: 256,
			},
			true,
			["encrypt", "decrypt"]
		)
		.then((res) => crypto.subtle.exportKey("raw", res))
		.then((res) => Buffer.from(res).toString("hex"));
}

// export async function createEncryptionKey(masterKey, env) {
// 	const value = await generateKey();
// 	const type = "enc";

// 	const encryptedValue = await encrypt(masterKey, value);

// 	return SecretService.create({
// 		uid: uuidv4(),
// 		name: "",
// 		value: encryptedValue,
// 		type,
// 		fk_environment: env,
// 	});
// }

// function importKey(key) {
// 	const buf = Buffer.from(key, "hex");
// 	return crypto.subtle.importKey(
// 		"raw",
// 		buf,
// 		{
// 			name: "AES-GCM",
// 			length: 256,
// 		},
// 		true,
// 		["encrypt", "decrypt"]
// 	);
// }

// export async function getEncryptionKey(masterKey, env) {
// 	return context().env.DB
// 		.prepare(
// 			`
//         SELECT * 
//         FROM secrets 
//         WHERE fk_environment = ? 
//         AND type = "enc" 
//         LIMIT 1
//     `
// 		)
// 		.bind(env)
// 		.first()
// 		.then(async (res) => {
// 			const decrypted_value = await decrypt(masterKey, res.value);

// 			return {
// 				...res,
// 				value: decrypted_value,
// 			};
// 		});
// }

// export async function getMasterKey() {
// 	if(!masterKey){
// 		masterKey = await SecretService.findOneByType({
// 			type: "master",
// 		})
// 	}
	
// 	return masterKey;
// }

// export async function initMasterKey() {
// 	const value = await generateKey();
// 	const type = "master";

// 	return SecretService.create({
// 		uid: uuidv4(),
// 		name: "master",
// 		value,
// 		type,
// 		fk_environment: null,
// 	});
// }

// export async function encrypt(key, string) {
// 	const k = await importKey(key);

// 	const encoder = new TextEncoder("utf-8");

// 	const stringBuf = encoder.encode(string);

// 	let iv = self.crypto.getRandomValues(new Uint8Array(12));
// 	// let iv = crypto.getRandomValues(new Uint8Array(12))

// 	const iv_str = Buffer.from(iv).toString("hex");

// 	let encrypted = await crypto.subtle.encrypt(
// 		{
// 			name: "AES-GCM",
// 			length: 256,
// 			iv,
// 		},
// 		k,
// 		stringBuf
// 	);

// 	encrypted = Buffer.from(encrypted).toString("hex");

// 	return iv_str + ":" + encrypted;
// }

// export async function decrypt(key, string) {
// 	const decoder = new TextDecoder("utf-8");

// 	const k = await importKey(key);

// 	const textParts = string.split(":");

// 	const iv = Uint8Array.from(Buffer.from(textParts[0], "hex"));

// 	const encrypted = Uint8Array.from(Buffer.from(textParts[1], "hex"));

// 	// console.log(Uint8Array.from(Buffer.from(iv_str, 'hex')))

// 	const decrypted = await crypto.subtle.decrypt(
// 		{
// 			name: "AES-GCM",
// 			length: 256,
// 			iv,
// 		},
// 		k,
// 		encrypted
// 	);

// 	return decoder.decode(decrypted);
// }

export async function hash(key) {
	const encoder = new TextEncoder("utf-8");

	const stringBuf = encoder.encode(key);

	const hashBuffer = await crypto.subtle.digest("SHA-256", stringBuf);

	return Buffer.from(hashBuffer).toString("hex");
}
