import { z } from "zod"

import { SharedDocSchema } from "../schemas.js"

export let collections = {} 

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
    const schema = SharedDocSchema.extend(collection.schema)

    const newCollection = {
        name: collection.name,
        indexes: collection.indexes ?? "++uuid",
        schema,
        props: parseKeys(schema)
    }
    
    collections[collection.name] = newCollection

    return newCollection
}

export function reference(collectionName){
    return collections[collectionName].schema
}

export function getCollection(collectionName){
    return collections[collectionName]
}

export function listCollections(){
    return Object.keys(collections)
}