import { 
    create,
    findOneByEmail,
    checkPassword,
    createSession,
    findSession,
    removeSession 
} from "./src/services/auth.js";

export { 
    create,
    findOneByEmail,
    checkPassword,
    createSession,
    findSession,
    removeSession 
};

export default {
    create,
    findOneByEmail,
    checkPassword,
    createSession,
    findSession,
    removeSession 
};