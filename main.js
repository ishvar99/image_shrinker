const { app, BrowserWindow, Menu, globalShortcut } = require("electron")
process.env.NODE_ENV = "development"
const isDev = process.env.NODE_ENV !== "production" ? true : false
const isMac = process.platform === "darwin" ? true : false
const path = require("path")
// if (isDev) {
//   require("electron-reload")(__dirname, {
//     electron: path.join(__dirname, "node_modules", ".bin", "electron.cmd"),
//     hardResetMethod: "exit",
//   })
// }
let mainWindow, aboutWindow
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrinker",
    width: 500,
    height: 600,
    icon: "./assets/icons/icon_128x128.png",
    resizable: isDev, //if development, resizable is true otherwise false,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  mainWindow.loadFile("./app/index.html")
}
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About Image Shrinker",
    width: 300,
    height: 300,
    icon: "./assets/icons/icon_128x128.png",
    resizable: false,
  })
  aboutWindow.loadFile("./app/about.html")
}
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  ...(!isMac
    ? [
        {
          label: "help",
          submenu: [
            {
              label: "about",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
]
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
app.on("ready", () => {
  createMainWindow()
  // globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload())
  // globalShortcut.register(isMac ? "Cmd+Alt+I" : "Ctrl+Shift+I", () =>
  //   mainWindow.toggleDevTools()
  // )
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
  app.on("closed", () => (mainWindow = null))
})
