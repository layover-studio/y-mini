import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

import { context } from "../context.js"

export function createTable() {
	return context().env.DB
		.prepare(
			`
			CREATE TABLE IF NOT EXISTS 
			paymentSessions (
				id INTEGER PRIMARY KEY, 
				created_at BIGINT DEFAULT CURRENT_TIMESTAMP,
				updated_at BIGINT DEFAULT CURRENT_TIMESTAMP,
				uid VARCHAR(36) NOT NULL,
				session_id TEXT,
				fk_organization INTEGER NOT NULL,
				FOREIGN KEY(fk_organization) REFERENCES organizations(id)
			);
    `
		)
		.run();
}

export async function create(args){
	const stripe = new Stripe(context().env.STRIPE_SK);

	const uid = args.uid ? args.uid : uuidv4()

	const session = await stripe.checkout.sessions.create({
		client_reference_id: uid,
		line_items: [
		  {
			price: context().env.STRIPE_PRICE_ID,
			quantity: 1
		  }
		],
		mode: 'subscription',
		success_url: `https://proxyvault.com/payment/success`,
		cancel_url: `https://proxyvault.com/payment/cancel`,
	  });

	await context().env.DB
	.prepare(`
		INSERT INTO paymentSessions (
			uid,
			session_id,
			fk_organization
		) VALUES (
			?,
			?,
			?
		)
	`)
	.bind(
		uid,
		session.id,
		args.organization.id
	)
	.run();

	return {
		success: true,
		uid,
		session_url: session.url,
		session_id: session.id
	};
}

export async function findOneBySessionId(args){
	const res = await context().env.DB
	.prepare(
		`
		SELECT * FROM paymentSessions WHERE session_id = ? LIMIT 1
	`
	)
	.bind(args.session_id)
	.first();

	return res;
}



export function dropTable() {
	return context().env.DB
		.prepare(
			`
        DROP TABLE IF EXISTS paymentSessions;
    `
		)
		.run();
}
