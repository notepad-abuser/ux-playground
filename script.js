import KeyboardHandler from "./classes/keyhandler.js";

console.log("?");

const qDiv = document.getElementById("key-q");
const wDiv = document.getElementById("key-w");
const aDiv = document.getElementById("key-a");
const sDiv = document.getElementById("key-s");
const dDiv = document.getElementById("key-d");
const zDiv = document.getElementById("key-z");

const keyCodesLabel = document.getElementById("keycodes-pressed-label");
const debugLabel = document.getElementById("debug-label");

const keyboard = new KeyboardHandler();
keyboard.addKeys("KeyQ", "KeyW", "KeyA", "KeyS", "KeyD", "KeyZ");

let counter = 0;

// Hold: event will retrigger
keyboard.addHoldListener("KeyQ", (event) => {
    keyCodesLabel.textContent = `q hold: ${++counter}`;
});

keyboard.addReleaseListener("KeyQ", (event) => {
    keyCodesLabel.textContent = "";
});

const assignKeyToDiv = (keyCode, divElement) => {
    divElement.classList.add("key-assigned");

    // Trigger: Event will only trigger once
    keyboard.addTriggerListener(keyCode, (event) => {
        divElement.classList.add("key-pressed");
    });

    keyboard.addReleaseListener(keyCode, (event) => {
        divElement.classList.remove("key-pressed");
    });
}

assignKeyToDiv("KeyQ", qDiv);
assignKeyToDiv("KeyW", wDiv);
assignKeyToDiv("KeyA", aDiv);
assignKeyToDiv("KeyS", sDiv);
assignKeyToDiv("KeyD", dDiv);
assignKeyToDiv("KeyZ", zDiv);

// All *assigned* keys get the same trigger / release handlers
keyboard.addTriggerListenerAll((event) => { 
    keyCodesLabel.textContent = Array.from(keyboard.keysPressed).join(" ");

    if (keyCodesLabel.textContent === "KeyW KeyA KeyS KeyD") {
        debugLabel.textContent = "wasd!";
    }
});

keyboard.addReleaseListenerAll((event) => {
    keyCodesLabel.textContent = Array.from(keyboard.keysPressed).join(" ");
    //debugLabel.textContent = "";
});

window.addEventListener("keydown", () => {
    debugLabel.textContent = keyboard.lastKeyPressed;
});