const {
   app,
   BrowserWindow,
   Menu,
   ipcMain
} = require("electron");
const path = require("path");
const url = require("url");
const myUtil = require("./util/myUtil");


let mainWindow;
app.on("ready", () => {
   mainWindow = new BrowserWindow();
   mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "view/mainWindow/mainWindow.html"),
      protocol: "file",
      slashes: true
   }));
})

ipcMain.on("mainWindow:files", (e, files) => {
   files.forEach(element => {
      let {
         name,
         path,
         type
      } = element;
      // 上传文件
      myUtil.qnUpdate(path, name).then((data) => {
         // 将结果返回给mainWindow
         mainWindow.webContents.send("mainWindow:result", data);
      }).catch((err) => {
         console.log(err);
      });
   });
})