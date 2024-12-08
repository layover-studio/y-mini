import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { context } from "../context.js"

import db from "./db.js";

export function createTable () {
    return db().prepare(`
        CREATE TABLE IF NOT EXISTS 
		paymentSession (
			id INTEGER PRIMARY KEY, 
			created_at BIGINT DEFAULT CURRENT_TIMESTAMP,
			updated_at BIGINT DEFAULT CURRENT_TIMESTAMP,
			uuid VARCHAR(36) UNIQUE,
			session_id TEXT,
			content TEXT,
			user_id INTEGER NOT NULL,
			website VARCHAR(255),
			FOREIGN KEY (user_id) REFERENCES user(id)
		);
    `)
    .run()
}

export async function create(args){
	const stripe = new Stripe(context.STRIPE_SK);

	const uuid = args.uuid ? args.uuid : uuidv4()

	const session = await stripe.checkout.sessions.create({
		client_reference_id: uuid,
		line_items: [
		  {
			price: context.STRIPE_PRICE_ID,
			quantity: 1
		  }
		],
		mode: 'payment',
		success_url: `http://localhost:4321/payment/success`,
		cancel_url: `http://localhost:4321/payment/cancel`,
	  });

	const id = await db().prepare(`
		SELECT u.id 
        FROM users AS u
        LEFT JOIN users_docs AS ud ON ud.user_id = u.id
        LEFT JOIN docs AS d ON d.id = ud.doc_id
        WHERE d.uuid = ? LIMIT 1;	
	`).bind(args.user.uuid).first('id') 

	await db()
	.prepare(`
		INSERT INTO paymentSession (
			uuid,
			session_id,
			user_id
		) VALUES (
			?,
			?,
			?
		)
	`)
	.bind(
		uuid,
		session.id,
		id
	)
	.run();

	return {
		success: true,
		uuid,
		session_url: session.url,
		session_id: session.id,
		user_id: id
	};
}

export async function findOneBySessionId(args){
	const res = await db()
	.prepare(
		`
		SELECT * FROM paymentSession WHERE session_id = ? LIMIT 1
	`
	)
	.bind(args.session_id)
	.first()

	return res;
}