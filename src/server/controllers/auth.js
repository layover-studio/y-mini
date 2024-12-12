import { Hono } from 'hono'
import { getCookie, setCookie } from "hono/cookie";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken"

import { generateState } from "arctic";
import { github } from "../services/github.js";

import * as CryptoService from "../services/crypto.js"
import * as UserService from "../services/user.js"
import * as SessionService from "../services/session.js"
import User from "../models/user.js"

const app = new Hono()

app.get('/login/github', async ctx => {
    const state = generateState();
	const url = await github().createAuthorizationURL(state, ["user:email"]);
	
	setCookie(ctx, "github_oauth_state", state, {
		path: "/",
		secure: true,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "Lax"
	});

	let res = url.toString()

	return ctx.redirect(res);
})

app.get('/login/github/callback', async ctx => {
	const code = ctx.req.query("code")?.toString() ?? null;
	const state = ctx.req.query("state")?.toString() ?? null;
	
	const storedState = getCookie(ctx).github_oauth_state ?? null;
	
	if (!code || !state || !storedState || state !== storedState) {
		throw new Error("Invalid state");
	}

	try {
		const tokens = await github().validateAuthorizationCode(code);
		
		const githubUser = await fetch("https://api.github.com/user", {
			headers: {
				"X-GitHub-Api-Version":"2022-11-28",
				"Accept": "application/vnd.github+json",
				"Authorization": `Bearer ${tokens.accessToken()}`,
				"User-Agent": "devreel"
			}
		})
		.then(res => res.json())
	
		let existingUser = await UserService.findOneByGithubId(githubUser.id ?? null)
			
		if (!existingUser) {		
			existingUser = new User({
				uuid: uuid(),
				github_id: githubUser.id,
				username: githubUser.login,
				email: githubUser.email,
				avatar_url: githubUser.avatar_url,
			})

			await existingUser.save()
		}
		
		const session = await SessionService.create(existingUser);

		setCookie(ctx, "session", session.uuid, {
			path: "/",
			secure: true,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			sameSite: "Strict"
		});

		const hasPaid = existingUser.hasPaid
		
		return ctx.redirect('http://localhost:4321/dashboard');
	} catch (e) {
		throw new Error(e.message)
	}
})

app.post('/logout', async ctx => {
	const session = ctx.get("session");
	
	if (!session) {
		return ctx.body(null, 401);
	}
	
	await auth.invalidateSession(session.id);
	
	ctx.header("Set-Cookie", auth.createBlankSessionCookie().serialize(), { append: true });

	return ctx.redirect("https://devreel.com/login?logout=true");
})

export default app
