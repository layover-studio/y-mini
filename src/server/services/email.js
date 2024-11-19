
export function sendEmail(to, subject, html) {
	return fetch("https://api.resend.com/emails", {
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + process.env.RESEND_SK,
		},
		method: "POST",
		body: JSON.stringify({
			from: "hi@devreel.app",
			to: [to],
			subject,
			html,
		}),
	});
}
