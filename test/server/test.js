// //  this is a proof of concept for an alternative way to create getters and setters for SharedDoc to make the API more flexible (no need to have a predefined schema)

// import test, { before, after } from 'node:test'
// import assert from 'node:assert'

// class Doc {
//     constructor(){
//         return new Proxy(this, {
//             get: function(target, prop, receiver) {        
//                 const methods = getAllMethodNames(target)

//                 if(!methods.has(prop)){
//                     return true
//                 }

//                 return Reflect.get(target, prop, receiver);
//             }
//         })
//     }

//     test () {
//         return true
//     }
// }

// class SubDoc extends Doc {
//     test2(){
//         return false
//     }
// }

// function getAllMethodNames(obj) {
//     let methods = new Set();

//     while (obj = Reflect.getPrototypeOf(obj)) {
//       let keys = Reflect.ownKeys(obj)
//       keys.forEach((k) => methods.add(k));
//     }
    
//     return methods;
// }

// before(async () => {
    
// })

// test('', async () => {
//     const t = new Doc()

//     assert(t.test())
//     assert(t.ok)
    
//     const t2 = new SubDoc()

//     assert(!t2.test2())
// })

// after(async () => {
    
// })