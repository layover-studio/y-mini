import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { WebSocketServer } from 'ws'
import { setupWSConnection } from './websocket/utils.js'

import AuthController from './controllers/auth.js'
// import PaymentWebhookController from './controllers/webhook/payment.js'

const server = new Hono()

server.use(cors())

server.use(async (ctx, next) => {
    try {
        return await next()
	} catch (err) {
        console.log(err)
        
        return ctx.json({
            ok: false,
            status: err.status || 500,
            error: err.message || err.toString(),
        }, 500)
	}
})

server.get('/test', async (ctx) => {
    return ctx.json({
        ok: true
    })
})

// server.post('/sync/:uid', async (ctx) => {
//     let update = await ctx.req.arrayBuffer()
//     update = new Uint8Array(update)

//     const uid = ctx.req.param('uid')
//     const parts = uid.split('.')

    
//     const dir = parts[0]
//     const doc_id = parts.length > 1 ? parts[1] : parts[0]

//     const persistence = getConnection(dir)
    
//     console.log(persistence)
//     const persistedYdoc = await persistence.getYDoc(doc_id)
//     // console.log(persistedYdoc.getMap('root').toJSON())
//     const res = Y.encodeStateAsUpdate(persistedYdoc)
    
//     await persistence.storeUpdate(`${uid}`, update)
    
//     // await persistence.destroy()

//     return new Response(res.buffer, {
//         status: 200,
//         headers: {
//             'Content-Type': 'application/octet-stream'
//         }
//     })
// })

// server.use('/api/*', async (ctx, next) => {
//     const authorizationHeader = ctx.req.header("Authorization");

// 	if (!authorizationHeader) {
// 		const err = new Error("Unauthorized");
// 		err.status = 401;
// 		throw err;
// 	}

// 	const sessionId = authorizationHeader.split(" ")[1];

//     const session = await AuthService.findSession(sessionId);

//     if (session.isExpired()) {
//         const err = new Error("Forbidden");
//         err.status = 403;
//         throw err;
//     }

//     ctx.data = {
//         session
//     };

// 	setContext(ctx)

//     await next()
// })

server.route('/', AuthController)
// server.route('/webhook/payment', PaymentWebhookController)

const LaybackServer = new Proxy(server, {})

LaybackServer.start = async function({ port } = {}) {
    const app = serve({
        fetch: LaybackServer.fetch,
        port: port,
    }, (info) => {
        console.log(`Listening on http://localhost:${info.port}`);
    })
    
    const wss = new WebSocketServer({ noServer: true })
    
    wss.on('connection', setupWSConnection)
    
    app.on('upgrade', (request, socket, head) => {    
        const handleAuth = ws => {
            // console.log(request.url)

            // TODO: get session token from request url
            
            // 	const sessionId = authorizationHeader.split(" ")[1];
            //     const session = await AuthService.findSession(sessionId);

            //     if (session.isExpired()) {
            //         const err = new Error("Forbidden");
            //         err.status = 403;
            //         throw err;
            //     }

            // TODO: check the user is allowed to connect to the document 
    
            // if (err || !client) {
            //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            //     socket.destroy();
            //     return;
            // }
        
            // socket.removeListener('error', onSocketError);
    
            wss.emit('connection', ws, request)
        }
    
        wss.handleUpgrade(request, socket, head, handleAuth)
    })
}

export default LaybackServer