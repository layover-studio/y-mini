import { clear } from './src/services/opfs.js'

const API_URL = 'http://localhost:3000';

export function login({ email, password } = {}){
    return fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(res => res.json())
}

export function signup({ email, password } = {}){
    return fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(res => res.json())
}

export async function logout(){
    await clear()
    
    return true 
}