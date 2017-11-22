const {
   ipcRenderer,
   clipboard
} = require("electron");

const app = new Vue({
   el: "#app",
   data: {
      isActive: false,
      reslutURL: "",
      text: ""
   },
   methods: {
      fileChange(event) {
         const files = event.target.files;
         if (files.length === 0) {
            //  未选择文件 Alert
            Materialize.toast('未选择文件!', 2000);
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
         this.isActive = true;
      },
      copy() {
         clipboard.writeText(this.reslutURL);
         // 已复制 Alert
         Materialize.toast('已复制', 1000);
      },
   },
});

const that = app.$data;

ipcRenderer.on("mainWindow:result", (e, data) => {
   // 收到返回
   that.isActive = false;
   that.reslutURL = data;
});