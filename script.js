import KeyboardHandler from "/classes/keyhandler.js";

const qDiv = document.getElementById("key-q");
const wDiv = document.getElementById("key-w");
const aDiv = document.getElementById("key-a");
const sDiv = document.getElementById("key-s");
const dDiv = document.getElementById("key-d");

const keypressLabel = document.getElementById("keypress-label");

const keyboard = new KeyboardHandler();
keyboard.addKeys("KeyQ", "KeyW", "KeyA", "KeyS", "KeyD");

let counter = 0;

// Hold: event will retrigger
keyboard.addHoldListener("KeyQ", (event) => {
    keypressLabel.textContent = `q hold: ${++counter}`;
});

keyboard.addReleaseListener("KeyQ", (event) => {
    keypressLabel.textContent = "";
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

// All *assigned* keys get the same trigger / release handlers
const keysPressed = new Set();

keyboard.addTriggerListenerAll((event) => { 
    keysPressed.add(event.key);
    keypressLabel.textContent = Array.from(keysPressed).join(" ");
});

keyboard.addReleaseListenerAll((event) => {
    keysPressed.delete(event.key);
    keypressLabel.textContent = Array.from(keysPressed).join(" ");
});
