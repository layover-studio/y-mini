import { GitHub } from "arctic";
import { context } from "../context.js"

export const github = () => {
	// console.log(context())
	return new GitHub(
		context.GITHUB_CLIENT_ID,
		context.GITHUB_CLIENT_SECRET
	);
}