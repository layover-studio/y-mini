import { z } from "zod"

import { defineCollection } from "./services/collection.js";

export const UserCollection = defineCollection({
    name: 'user',
    schema: {
        username: z.string(),
        github_id: z.string(),
        email: z.string(),
        avatar_url: z.string(),
        role: z.string(),
        hasPaid: z.string(), //signed jwt
        organizations: z.string(), //signed jwt
        _prelim_organizations: z.array(z.object({
            organization: z.string(),
            action: z.string()
        }))
    }
});

export const UserGroupCollection = defineCollection({
    name: 'userGroup',
    schema: {
        name: z.string(),
        isAnonymous: z.boolean(),
        scenes: z.array(z.string())
    }
});