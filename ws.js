import assert from 'node:assert'

import WebSocket from 'ws';

// create new shared doc

// sync

// check 

// create new empty doc

// sync

// check the two docs are the same

const ws = new WebSocket(`ws://localhost:8787/websocket`);
    
ws.on('error', (err) => {
    console.error(err)
    ws.close()
});

ws.on('open', () => {
    ws.send('PING')
})

ws.on('message', (data) => {
    console.log(data.toString())
});

setTimeout(() => {}, 5000)
