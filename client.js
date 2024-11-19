import SharedDocModel from "./src/core/models/shared-doc.js"
import SharedObjectModel from "./src/core/models/shared-object.js"
import SharedArrayModel from "./src/core/models/shared-array.js"
export { parseKeys } from "./src/core/services/zod.js"

export const SharedDoc = SharedDocModel
export const SharedObject = SharedObjectModel
export const SharedArray = SharedArrayModel

export default {
    SharedDoc,
    SharedObject,
    SharedArray
}