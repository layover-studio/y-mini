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

export const UserSchema = {
    username: z.string(),
    github_id: z.string(),
    email: z.string(),
    avatar_url: z.string(),
    role: z.string(),
    hasPaid: z.string(), //signed jwt
}

export const UserGroupSchema = {
    name: z.string()
}