import * as Y from 'yjs';

function init(){
    const root = new Y.Doc();
    const folder = root.getMap()

    const collection = new Y.Doc()
    collection.getMap('root').set("name", "collection")
    const subfolder = collection.getMap()

    const item = new Y.Doc()
    item.getMap('root').set("name", "item")
    subfolder.set('item1', item)
    
    folder.set('collection1', collection)

    return root
}

(() => {
    const root = init()

    // console.log(root.getMap().get('collection1').getMap().get('item1').getMap('root').get('name'))
    console.log(Array.from(root.getMap().values()))
})()