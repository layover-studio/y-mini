The web framework to launch fast and relax.

## Installation

```bash
npm install layback
```

## Quickstart

```js
import { SharedDoc } from "layback/model"

const doc = new SharedDoc({
    title: "My first document",
    content: "Hello, world!"
})

await doc.sync(() => {
    console.log("Saved: " + JSON.stringify(doc.toJSON()))
})

doc.title = "My first document (updated)"
```

## Offline-first

Layback is designed to work offline: 

- It uses a local database to store your data.
- But it also syncs it automatically with the server when you're online via websocket.

## Real-time, multiplayer, multi-device

Layback is real-time: 

- You can see changes made by other users in real-time. 
- It also supports multi-device: you can edit the same document on multiple devices and see changes in real-time.

## Conflict-free replication

Layback uses yjs, a CRDT (Conflict-free Replicated Data Type) to ensure that changes made by different users are merged correctly with interesting properties:

- The order of changes doesn't matter.
- All updates can be encoded in binary format for easy storage and transmission.
- It's fast, memory-efficient, and scales to millions of users.   

## Validation

Via Zod

## Authentication & authorization

- Authentication via JWT.
- Authorization via read-only shared access lists.  

## Automated backend

- Your backend in one line of code.
- Runtime-agnostic. Works with Node.js, Deno, Cloudflare Workers, etc.
- Extensible: add your own API endpoints, middleware, etc.

## Easy testing

- All shared data structures are runtime-agnostic, so you can test your app in Node.js, Deno, browsers, etc.
- The databases are all files or in-memory, so you can easily test your app.