import { Lucia, TimeSpan } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db.js";

let auth_o = false;

export const auth = () => {
	if (!auth_o) {
        const adapter = new D1Adapter(db(), {
            user: "user",
            session: "session"
        });

		auth_o = new Lucia(adapter, {
				sessionCookie: {
					attributes: {
						// secure: true,
                        domain: process.env.FRONT_DOMAIN
					}
				},
                getSessionAttributes: (attributes) => {
                    return {
                        username: attributes.username
                    };
                },
				getUserAttributes: (attributes) => {
					return {
						githubId: attributes.github_id,
						username: attributes.username,
						avatar_url: attributes.avatar_url,
						hasPaid: attributes.hasPaid,
					};
				},
			}
		);
	}

	return auth_o;
};

export default auth;