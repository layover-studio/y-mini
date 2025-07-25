import { z } from "zod"

export const SharedDocSchema = z.object({
    uuid: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    members: z.string().optional(),
    _prelim_acl: z.array(z.object({
        user: z.string(),
        role: z.string(),
        action: z.string()
    })).optional(),
    isDeleted: z.boolean().optional()
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