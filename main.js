const { app, BrowserWindow } = require("electron")
let mainWindow
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrinker",
    width: 500,
    height: 600,
    icon: "./assets/icons/icon_128x128.png",
  })
  mainWindow.loadFile("./app/index.html")
}

app.on("ready", createMainWindow)
