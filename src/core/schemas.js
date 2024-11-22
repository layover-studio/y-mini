import { z } from "zod"

export const UserSchema = z.object({
    uuid: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
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
    })),
    isDeleted: z.boolean()
});

export const UserGroupSchema = z.object({
    uuid: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    name: z.string(),
    isAnonymous: z.boolean(),
    members: z.string(),
    scenes: z.array(z.string()),
    _prelim_acl: z.array(z.object({
        user: z.string(),
        role: z.string(),
        action: z.string()
    })),
    isDeleted: z.boolean()
});