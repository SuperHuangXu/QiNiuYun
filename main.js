const {
   app,
   BrowserWindow,
   Menu,
   ipcMain
} = require("electron");
const path = require("path");
const url = require("url");


// 调试模式 npm start "debug"
const debug = process.argv[2] === "debug";

let mainWindow = null;

function initialize() {
   // const shouldQuit = makeSingleInstance();
   // if (shouldQuit) return app.quit();

   (function createWindow() {
      const windowOptions = {
         backgroundColor: '#eeeeee ',
         show: false,

      }
      mainWindow = new BrowserWindow(windowOptions);
      mainWindow.loadURL(url.format({
         pathname: path.join(__dirname, "view/mainWindow/mainWindow.html"),
         protocol: "file",
         slashes: true
         // 或者: path.join('file://', __dirname, '/view/mainWindow/mainWindow.html')
      }))

      mainWindow.on("closed", () => {
         mainWindow = null;
      })

      mainWindow.on('ready-to-show', () => {
         mainWindow.show();
      })
      // handle
      require("./mainHandle");
      const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
      Menu.setApplicationMenu(mainMenu);
   })();


   // open devtools.
   if (debug) {
      mainWindow.openDevTools();
   }
}

/**
 * 只能打开一个实例窗口
 * 如果试图打开第二个窗口，则恢复第一个窗口并focus.
 */
function makeSingleInstance() {
   if (process.mas) return false

   return app.makeSingleInstance(function() {
      if (mainWindow) {
         if (mainWindow.isMinimized()) mainWindow.restore()
         mainWindow.focus()
      }
   })
}

app.on("ready", () => {
   initialize();
})

const mainMenuTemplate = [{
   label: "File",
   click() {

   }
}];