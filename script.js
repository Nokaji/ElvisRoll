const { ipcRenderer } = require("electron");
const path = require("path");
const Speaker = require('speaker');
const fs = require("fs");

const audioFilePath = path.join(__dirname, 'audio.mp3');

const screenWidth = window.screen.width / 2;
const screenHeight = window.screen.height / 2;

ipcRenderer.emit("window", "window_height", screenHeight);
ipcRenderer.emit("window", "window_width", screenWidth);

function playLoop() {
    const speaker = new Speaker();
    const audioStream = fs.createReadStream(audioFilePath);

    audioStream.pipe(speaker);

    audioStream.on('end', () => {
      playLoop(); // Relancer la lecture en boucle
    });
}

playLoop();