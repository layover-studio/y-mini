import { z } from "zod"

export const SharedDocSchema = z.object({
    uuid: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    members: z.string().optional(),
    _prelim_acl: z.array(z.object({
        user: z.string(),
        role: z.string(),
        action: z.string()
    })),
    isDeleted: z.boolean()
})

export const UserSchema = SharedDocSchema.extend({
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
});

export const UserGroupSchema = SharedDocSchema.extend({
    name: z.string(),
    isAnonymous: z.boolean(),
    scenes: z.array(z.string()),
});