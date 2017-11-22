const {
   ipcMain
} = require("electron");
const myUtil = require("./util/myUtil");

// Handle
ipcMain.on("mainWindow:files", (event, files) => {
   files.forEach(element => {
      let {
         name,
         path,
         type
      } = element;
      // 上传文件
      myUtil.qnUpdate(path, name).then((data) => {
         // 将结果返回给mainWindow
         event.sender.send("mainWindow:result", data);
      }).catch((err) => {
         console.log(err);
      });
   });
})