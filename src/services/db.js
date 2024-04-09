import { Level } from 'level'

export function open(name){
    return new Level(name, { 
        valueEncoding: 'json'
    })
}