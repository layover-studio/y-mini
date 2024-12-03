import { collections } from "../../core/services/collection.js"
import { db } from "./db.js";

export function getCollection(collectionName){
    return db()[collections[collectionName].name]
}