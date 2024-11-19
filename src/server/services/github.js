import { GitHub } from "arctic";

export const github = () => {
	// console.log(context())
	return new GitHub(
		process.env.GITHUB_CLIENT_ID,
		process.env.GITHUB_CLIENT_SECRET
	);
}