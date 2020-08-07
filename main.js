const path = require("path")
const os = require("os")
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron")
const imagemin = require("imagemin")
const imageminMozjpeg = require("imagemin-mozjpeg")
const imageminPngquant = require("imagemin-pngquant")
const slash = require("slash")
process.env.NODE_ENV = "development"
const isDev = process.env.NODE_ENV !== "production" ? true : false
const isMac = process.platform === "darwin" ? true : false
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
ipcMain.on("img:minimize", (e, options) => {
  options.destination = path.join(os.homedir(), "imageshrink")
  minimizeImage(options)
})
async function minimizeImage({ imgPath, quality, destination }) {
  console.log(quality)
  try {
    const pngQuality = quality / 100
    const files = await imagemin([slash(imgPath)], {
      destination,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({
          quality: [pngQuality, pngQuality],
        }),
      ],
    })
    shell.openPath(destination)
  } catch (error) {
    console.log(error)
  }
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
