let context_o = false;

export function setContext(newContext) {
    context_o = newContext;
}

export function context() {
    return context_o;
}