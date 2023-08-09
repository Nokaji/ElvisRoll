const { BrowserWindow, app, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = require("./isdev");

let frame;
let window_height;
let window_width;
let count;

const randomPositionX = () => {
    return Math.random(0, window_width);
}

const randomPositionY = () => {
    return Math.random(0, window_height);
}

ipcMain.on("window", (event, info) => {
    switch (event) {
        case "window_height": {
            window_height = info;
            break;
        }
        case "window_width": {
            window_width = info;
            break;
        }
    }
});

function changeWindowPosition(){
    const screenWidth = frame.getSize()[0];
    const screenHeight = frame.getSize()[1];

    // Générer de nouvelles coordonnées X et Y aléatoires
    const newX = Math.floor(Math.random() * (screenWidth - 100)); // Limiter pour ne pas sortir de l'écran
    const newY = Math.floor(Math.random() * (screenHeight - 100));

    frame.setPosition(newX, newY);
}

const createWindow = () => {
    frame = new BrowserWindow({
        width: 700,
        height: 500,
        resizable: false,
        frame: false,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
            contextIsolation: false,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true
        },
        backgroundColor: '#11101D'
    });

    frame.webContents.openDevTools();

    frame.loadFile("app.html");
    
    frame.removeMenu();

    frame.on('closed', () => {
        frame = null;
        createWindow();
        count -= 1;
    });

    if(!isDev){
        setInterval(changeWindowPosition, 75);
    }
}

while (count < 10) {
    createWindow();
    count += 1;
}

app.on('ready', () => {
    createWindow();
});