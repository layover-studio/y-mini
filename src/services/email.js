import { context } from "../context.js";

export function sendEmail(to, subject, html) {
	return fetch("https://api.resend.com/emails", {
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + context().env.RESEND_SK
		},
		method: "POST",
		body: JSON.stringify({
			from: "hi@olorin.com",
			to: [to],
			subject,
			html,
		}),
	});
}