import { GitHub } from "arctic";
import { context } from "../context.js"

export const github = () => {
	return new GitHub(
		context.GITHUB_CLIENT_ID,
		context.GITHUB_CLIENT_SECRET,
		"http://localhost:8787/login/github/callback"
	);
}