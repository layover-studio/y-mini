// import test, { before, after } from 'node:test'
// import assert from 'node:assert'
// // import { unstable_dev } from "wrangler"

// import WebSocket from 'ws';

// // let worker

// // before(async () => {
// //     worker = await unstable_dev("./server.js", {
// //         experimental: { disableExperimentalWarning: true },
// //     });
// // })

// test('send and receive messages', async (t) => {
//     // const ws = new WebSocket(`ws://websocket-hibernation-server.baz-b17.workers.dev/websocket`);
//     const ws = new WebSocket(`ws://localhost:8787/websocket`);
        
//     ws.on('error', (err) => {
//         console.error(err)
//         ws.close()
//     });

//     ws.on('open', () => {
//         ws.send('PING')
//     })
    
//     ws.on('message', (data) => {
//         console.log(data.toString())
//     });


//     setTimeout(() => {}, 5000)
// })

// // after(async () => {
// //     await worker.stop()
// // })