import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import {
	getCookie
  } from 'hono/cookie'
//   import { serve } from '@hono/node-server'
// import { verifyRequestOrigin } from "lucia";
// import { WebSocketServer } from 'ws'
import { DurableObject } from "cloudflare:workers";

import AuthController from './controllers/auth.js'

import { setContext } from './context.js';
// import UserAPI from './src/controllers/api/user.js'
// import PaymentAPI from './src/controllers/api/payment.js'
// import PaymentWebhook from './src/controllers/webhook/payment.js'
// import DocsAPI from './src/controllers/api/docs.js'

// import auth from './src/services/auth.js'

// import { setupWSConnection } from './src/websocket/utils.js'

const server = new Hono()

server.post('/ping', async (ctx) => {
	const { input } = await ctx.req.json()

    if(input != 'PING') {
        return ctx.json({ ok: false })
    }

	return ctx.json({ ok: true, result: 'PONG' })
})

server.notFound((c) => {
	throw new HTTPException(404, { 
		ok: false,
		status: 404,
		message: "API endpoint not found" 
	})
})

server.onError((err, ctx) => {
	console.log(err)

	return ctx.json({
		ok: false,
		error: err.message || err.toString() 
	}, err.status || 500)
})

// server.use(cors({
// 	origin: [
// 		'https://devreel.app', 
// 		'http://localhost:4321',
// 	],
// 	credentials: true
// }))

server.use(async (ctx, next) => {
    try {
		setContext(ctx.env)

		await next()
	} catch (err) {
		throw new HTTPException(err.status || 500, { 
			ok: false,
			status: err.status || 500,
			error: err.message || err.toString() 
		})
	}
})

// server.get('/cookie', async (ctx) => {
// 	const sessionId = getCookie(ctx, 'session')

// 	const { session, user } = await auth().validateSession(sessionId);

// 	return ctx.json({ ok: true })
// })

server.route('/', AuthController)
// // server.route('/waitlist', WaitlistController)
// // server.route('/webhook/payment', PaymentWebhookController)

// server.use('/api/*', async (ctx, next) => {
// 	const originHeader = ctx.req.header("Origin");
	
// 	const hostHeader = ["devreel.com", "localhost:8787", "localhost:4321"];

// 	if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, hostHeader)) {
// 		return new Response(null, {
// 			status: 403
// 		});
// 	}
	
// 	const sessionId = getCookie(ctx, "session")

// 	const { session } = await auth().validateSession(sessionId);

// 	if (!session) {
// 		const err = new Error("Forbidden");
// 		err.status = 403;
// 		throw err;
// 	}

// 	ctx.data = {
// 		session
// 	};

//     await next()
// })

// server.route('/api/user', UserAPI)
// server.route('/api/docs', DocsAPI)
// server.route('/api/payment', PaymentAPI)
// server.route('/webhook/payment', PaymentWebhook)
// // server.route('/api/payment', PaymentApiController)

server.get('/websocket', async (ctx) => {
    const upgradeHeader = ctx.req.header('Upgrade');
    // console.log(upgradeHeader)

    if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Durable Object expected Upgrade: websocket', { status: 426 });
    }


    let id = ctx.env.WEBSOCKET_MANAGER.idFromName("foo");
    let stub = ctx.env.WEBSOCKET_MANAGER.get(id);

    return stub.fetch(ctx.req.raw);
})

export class WebSocketServer extends DurableObject {
	async fetch(request) {
	  const webSocketPair = new WebSocketPair();
	  const [client, server] = Object.values(webSocketPair);
  
	  this.ctx.acceptWebSocket(server);
  
	  return new Response(null, {
		status: 101,
		webSocket: client,
	  });
	}
  
	async webSocketMessage(ws, message) {
	  ws.send('PONG');
	}
  
	async webSocketClose(ws, code, reason, wasClean) {
	  ws.close(code, "Durable Object is closing WebSocket");
	}
  }

// const LaybackServer = new Proxy(server, {})

// LaybackServer.start = async function({ port = 8787 } = {}) {
//     const app = serve({
//         fetch: LaybackServer.fetch,
//         port: port,
//     }, (info) => {
//         console.log(`Listening on http://localhost:${info.port}`);
//         // console.log(`env vars: ${JSON.stringify(process.env)}`);
//     })
    
//     const wss = new WebSocketServer({ noServer: true })
    
//     wss.on('connection', setupWSConnection)
    
//     app.on('upgrade', (request, socket, head) => {    
//         const handleAuth = async (ws) => {
//             console.log(request.url)

//             const url = new URL(`http://localhost:8000${request.url}`)

//             const sessionId = url.searchParams.get('token')

//             if (!sessionId) {
//                 console.log("Unauthorized")
//                 socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//                 socket.destroy();
//                 return;
//             }

//             // const session = await AuthService.findSession(sessionId);

// 			// readonly docs: https://discuss.yjs.dev/t/read-only-or-one-way-only-sync/135/4

//             // if (session.isExpired()) {
//             //     console.log("Unauthorized")
//             //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//             //     socket.destroy();
//             //     return;
//             // }

//             // TODO: check the user is allowed to connect to the document

            
        
//             // socket.removeListener('error', onSocketError);
    
//             wss.emit('connection', ws, request)
//         }
    
//         wss.handleUpgrade(request, socket, head, handleAuth)
//     })
// }

export default server