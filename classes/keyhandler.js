export function hello () {
    console.log("hello from keyhandler.js");
}

class Key {
    constructor () {
        this.onTrigger = new Set();
        this.onHold = new Set();
        this.onRelease = new Set();
    }            
}

export default class KeyboardHandler {
    #keys
    #keysPressed
    #lastKeyPressed

    #context

    constructor (context = undefined) {
        this.#keys = new Map();
        this.#keysPressed = new Set();
        this.#lastKeyPressed = null;

        this.#context = context ?? window;
        this.#context.addEventListener("keydown", this.#handleKeydown); // TODO: understand 'this'
        this.#context.addEventListener("keyup", this.#handleKeyup); // TODO: understand 'this'
    }

    get keysPressed () { return this.#keysPressed; }
    get lastKeyPressed () { return this.#lastKeyPressed; }

    #ensureKey (keyCode) {
        if (!this.#keys.has(keyCode)) this.#keys.set(keyCode, new Key());
    }

    addKeys (...keyCodes) {
        keyCodes.forEach((keyCode) => {
            this.#keys.set(keyCode, new Key());
        });
    }

    addTriggerListener (keyCode, callbackFn) {
        this.#ensureKey(keyCode);
        this.#keys.get(keyCode).onTrigger.add(callbackFn);
    }

    addHoldListener (keyCode, callbackFn) {
        this.#ensureKey(keyCode);
        this.#keys.get(keyCode).onHold.add(callbackFn);
    }

    addReleaseListener (keyCode, callbackFn) {
        this.#ensureKey(keyCode);
        this.#keys.get(keyCode).onRelease.add(callbackFn);
    }

    addTriggerListenerAll (callbackFn) {
        this.#keys.forEach((keyObject) => {
            keyObject.onTrigger.add(callbackFn);
        });
    }

    addHoldListenerAll (callbackFn) {
        this.#keys.forEach((keyObject) => {
            keyObject.onHold.add(callbackFn);
        });
    }

    addReleaseListenerAll (callbackFn) {
        this.#keys.forEach((keyObject) => {
            keyObject.onRelease.add(callbackFn);
        });
    }

    #handleKeydown = (event) => {
        const keyCode = event.code;
        const keyObject = this.#keys.get(keyCode);

        if (!keyObject) return;

        this.#lastKeyPressed = keyCode;
        this.#keysPressed.add(keyCode);

        if (event.repeat) {
            keyObject.onHold.forEach(callbackFn => callbackFn(event));
        } else {
            keyObject.onTrigger.forEach(callbackFn => callbackFn(event));
        }
    }

    #handleKeyup = (event) => {
        const keyCode = event.code;
        const keyObject = this.#keys.get(keyCode);

        if (!keyObject) return;

        this.#keysPressed.delete(keyCode);

        keyObject.onRelease.forEach(callbackFn => callbackFn(event));
    }
}