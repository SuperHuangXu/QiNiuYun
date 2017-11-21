const {
   ipcRenderer,
   clipboard
} = require("electron");

const app = new Vue({
   el: "#app",
   data: {
      updateing: "", // class 为 progress时显示进度条。
      reslutURL: "",
      text: ""
   },
   methods: {
      fileChange(event) {
         const files = event.target.files;
         console.log(files);
         if (files.length === 0) {
            JSAlert.alert("未选择文件！").dismissIn(1000 * 1.5);
            return;
         }
         // 序列化发送数据
         let data = [];
         for (const iterator of files) {
            let {
               name,
               path,
               type
            } = iterator;
            data.push({
               name,
               path,
               type
            })
            this.text = name;
         }

         // 将数据发送到主进程
         ipcRenderer.send("mainWindow:files", data);
         this.updateing = "progress";
      },
      copy() {
         clipboard.writeText(this.reslutURL);
         JSAlert.alert("已复制").dismissIn(1000 * 1.5);
      }
   },
});

const that = app.$data;

ipcRenderer.on("mainWindow:result", (e, data) => {
   // 收到返回
   that.updateing = "";
   that.reslutURL = data;
   console.log(that.reslutURL);
});