const readline = require("readline");

const {settingsScene} = require("./utils/scenes");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function run() {
    await settingsScene(rl)
}

run();