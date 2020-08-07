const { app, BrowserWindow } = require("electron")
process.env.NODE_ENV = "development"
const isDev = process.env.NODE_ENV !== "production" ? true : false
const isMac = process.platform === "darwin" ? true : false
let mainWindow
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrinker",
    width: 500,
    height: 600,
    icon: "./assets/icons/icon_128x128.png",
    resizable: isDev, //if development, resizable is true otherwise false
  })
  mainWindow.loadFile("./app/index.html")
}
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit()
  }
})
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})
app.on("ready", createMainWindow)
