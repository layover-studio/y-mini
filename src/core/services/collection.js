import { z } from "zod"

const SharedDocSchema = z.object({
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

let collections = false 

export function parseKeys (schema) {
    if (
      schema instanceof z.ZodNullable ||
      schema instanceof z.ZodOptional
    ) {
        return parseKeys(schema.unwrap())
    }

    if (schema.element) {
        return parseKeys(schema.element)
    }

    if(schema.shape) {
        const entries = Object.entries(schema.shape)
        
        return entries.flatMap(([key, value]) => {
            return key
        })
    }

    return false
}

export function defineCollection(collection){
    const schema = SharedDocSchema.extend({
        ...collection.schema
    })
    
    collections[collection.name] = {
        name: collection.name,
        indexes: collection.indexes ?? "++uuid",
        schema,
        props: parseKeys(schema)
    }
}

export function reference(collectionName){
    return collections[collectionName].schema
}

export function getCollection(collectionName){
    return collections[collectionName]
}