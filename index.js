import SharedDoc from "./src/client/models/shared-doc.js"

(() => {
    const doc = new SharedDoc()
    console.log(doc.save)
})()