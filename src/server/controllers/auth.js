import { Hono } from 'hono'
import { getCookie, setCookie } from "hono/cookie";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"

import auth from "../services/auth.js";

import { generateState } from "arctic";
import { generateId } from "lucia";
import { github } from "../services/github.js";

import * as CryptoService from "../services/crypto.js"
import * as UserService from "../services/user.js"

const app = new Hono()

app.get('/login/github', async ctx => {
    const state = generateState();
	const url = await github().createAuthorizationURL(state);
	
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
				"Authorization": `Bearer ${tokens.accessToken}`,
				"User-Agent": "devreel"
			}
		})
		.then(res => res.json())
	
		let existingUser = await UserService.findOneByGithubId(githubUser.id ?? null)
			
		if (!existingUser) {		
			existingUser = await UserService.create({
				id: generateId(15),
				github_id: githubUser.id,
				username: githubUser.login,
				email: githubUser.email,
				avatar_url: githubUser.avatar_url
			})
		}
		
		const session = await auth().createSession(existingUser.id, {});

		setCookie(ctx, "session", session.id, {
			path: "/",
			secure: true,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			sameSite: "Strict"
		});

		const hasPaid = existingUser.hasPaid
		
		return ctx.redirect(hasPaid ? 
			`http://localhost:4321/studio`
			:
			`http://localhost:4321/payment`
		);
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
