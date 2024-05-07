export async function readFile(path){
    const opfsRoot = await navigator.storage.getDirectory();

    const pathParts = path.split('/')
    const size = pathParts.length
    let dir = opfsRoot;
    
    for (let i = 0; i < size - 1; i++) {
      const part = pathParts[i]
      dir = await dir.getDirectoryHandle(part, { create: true })
    }

    const fileHandle = await dir.getFileHandle(pathParts[size - 1], { create: true })

    return fileHandle
}

export async function clear(){
    const rootDir = await navigator.storage.getDirectory()
    
    for await (const [key, value] of rootDir.entries()) {
        await rootDir.removeEntry(key, { recursive: true })
    }
}