import LaybackServer from '../src/server/index.js'

(async () => {
    LaybackServer.start({ 
        port: 47400 
    });
})()