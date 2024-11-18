import { z } from "zod";

export function parseKeys (schema) {
    // console.log(Object.entries(schema.shape).flatMap(([key, value]) => key))
    // // console.log(z.instanceof(schema))
    // // console.log(Object.getPrototypeOf(schema))
    // // console.log(schema instanceof z.ZodObject)
    // if (
    //   schema instanceof z.ZodNullable ||
    //   schema instanceof z.ZodOptional
    // ) {
    //     return parseKeys(schema.unwrap())
    // }

    // if (schema instanceof z.ZodArray) {
    //     return parseKeys(schema.element)
    // }
    
    // if (schema instanceof z.ZodObject) {
    //     const entries = Object.entries(schema.shape)
        
    //     return entries.flatMap(([key, value]) => {
    //         // const nested = this.keys(value).map(
    //         //     (subKey) => `${key}.${subKey}`
    //         // )
            
    //         // return nested.length ? nested : key

    //         return key
    //     })
    // }

    const entries = Object.entries(schema.shape)
        
    return entries.flatMap(([key, value]) => {
        // const nested = this.keys(value).map(
        //     (subKey) => `${key}.${subKey}`
        // )
        
        // return nested.length ? nested : key

        return key
    })
};