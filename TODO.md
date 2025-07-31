## roadmap

1. article pocs using clowdr (~ 2 weeks max)
   1. [ ] collection orm
      1. [ ] findby
      2. [ ] data validation
      3. [ ] unit testing
         1. offline idb
   2. [ ] sync
      1. [ ] http / sse
      2. [ ] websocket
      3. [ ] webrtc
      4. [ ] global background sync
         1. sync all documents using the background fetch api
   3. [ ] auth
      1. [ ] how to handle authorization in a yjs document
      2. [ ] multi-tenancy
         1. [ ] user collection
   4. [ ] awareness
      1. [ ] how to implement awareness UI
2. product poc using layback (one week)
   1. fast editor
   2. gitmage / gitjournal
   3. auto subtitle 
3. cli to generate code? like laravel's artisan
4. layback framework
   1. layback = yjs wrapper with better DX
   2. need a layback framework that provides an opinionated way to do most web dev tasks, like nextjs vs react
      1. crypto
      2. auth
      3. database
      4. networking
      5. dev overlay
5. cloud infrastructure
   1. should be able to deploy in one command line (wrangler wrapper poc)
6. launch

it's more than speed, it's a new paradigm to build web apps for a more collaborative, inclusive world