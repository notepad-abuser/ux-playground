export function hello () {
    console.log("hello from keyhandler.js");
}

export class KeyHandler {
    #onTrigger;
    #onRelease;
    #context;

    constructor (keyCode, context = undefined) {
        this.keyCode = keyCode;
        this.#onTrigger = new Set();
        this.#onRelease = new Set();

        this.#context = context ? context : window;
    }

    addTriggerListener (callbackFn) {
        this.#context.addEventListener("keydown", 
            (event) => {
                if (event.code == this.keyCode && !event.repeat) {
                    callbackFn(event);
                }
            }
        );
    }

    addHoldListener (callbackFn) {
        this.#context.addEventListener("keydown", 
            (event) => {
                if (event.code == this.keyCode) {
                    callbackFn(event);
                }
            }
        );
    }

    addReleaseListener (callbackFn) {
        this.#context.addEventListener("keyup", 
            (event) => {
                if (event.code === this.keyCode) {
                    callbackFn(event);
                }
            }
        );
    }
}

export default class KeyboardHandler {
    #context
    #keyHandlers

    constructor (context = undefined) {
        this.#keyHandlers = new Map();
        this.#context = context ? context : window;
    }

    addKeys (...keyCodes) {
        keyCodes.forEach((keyCode) => {
            this.#keyHandlers.set(keyCode, new KeyHandler(keyCode, this.#context));
        });
    }

    addTriggerListener (keyCode, callbackFn) {
        this.#keyHandlers.get(keyCode).addTriggerListener(callbackFn);
    }

    addTriggerListenerAll (callbackFn) {
        // `(key, keyCode)` is `(value, key)`, but we have a different meaning for `key` here...
        this.#keyHandlers.forEach((keyHandler, keyCode) => {
            keyHandler.addTriggerListener(callbackFn);
        });
    }

    addHoldListener (keyCode, callbackFn) {
        this.#keyHandlers.get(keyCode).addHoldListener(callbackFn);
    }

    addHoldListenerAll (callbackFn) {
        this.#keyHandlers.forEach((keyHandler, keyCode) => {
            keyHandler.addHoldListener(callbackFn);
        });
    }

    addReleaseListener (keyCode, callbackFn) {
        this.#keyHandlers.get(keyCode).addReleaseListener(callbackFn);
    }

    addReleaseListenerAll (callbackFn) {
        // `(key, keyCode)` is `(value, key)`, but we have a different meaning for `key` here...
        this.#keyHandlers.forEach((keyHandler, keyCode) => {
            keyHandler.addReleaseListener(callbackFn);
        });
    }
}
