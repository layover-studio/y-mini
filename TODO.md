- rewrite tests

- should be able to ask backend for diffs (check what's available locally vs remote) 
  - endpoint + service function
  - when buildacl => add users_docs row
  - compare idb uuids with users_docs uuids
  - one-time sync difference to get up to date

- should be able to one-time sync doc via http
  - endpoint + service function

- should be able to sync a doc via websocket
  - create client script for testing
  - should be able to manage connections