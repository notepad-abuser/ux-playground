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
    #keysPressed
    #keysHeld

    constructor (context = undefined) {
        this.#keyHandlers = new Map();
        this.#keysPressed = new Set();
        this.#keysHeld = new Set();

        this.#context = context ? context : window;
    }

    get keysPressed () { return this.#keysPressed; }

    get keysHeld () { return this.#keysHeld; }

    addKeys (...keyCodes) {
        keyCodes.forEach((keyCode) => {
            this.#keyHandlers.set(keyCode, new KeyHandler(keyCode, this.#context));
        });
    }

    addTriggerListener (keyCode, callbackFn) {
        this.#keyHandlers.get(keyCode).addTriggerListener((event) => {
            this.#keysPressed.add(keyCode);
            callbackFn(event);
        });
    }

    addTriggerListenerAll (callbackFn) {
        this.#keyHandlers.forEach((keyHandler, keyCode) => {
            this.addTriggerListener(keyCode, callbackFn);
        });
    }

    addHoldListener (keyCode, callbackFn) {
        this.#keyHandlers.get(keyCode).addHoldListener((event) => {
            this.#keysHeld.add(keyCode);
            callbackFn(event);
        });
    }

    addHoldListenerAll (callbackFn) {
        this.#keyHandlers.forEach((keyHandler, keyCode) => {
            this.addHoldListener(callbackFn);
        });
    }

    addReleaseListener (keyCode, callbackFn) {
        this.#keyHandlers.get(keyCode).addReleaseListener((event) => {
            this.#keysPressed.delete(keyCode);
            if (this.#keysHeld.has(keyCode)) this.#keysHeld.delete(keyCode);
            callbackFn(event);
        });
    }

    addReleaseListenerAll (callbackFn) {
        this.#keyHandlers.forEach((keyHandler, keyCode) => {
            this.addReleaseListener(keyCode, callbackFn);
        });
    }
}
