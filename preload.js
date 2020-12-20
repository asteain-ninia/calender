const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        send: () => { // レンダラーからの送信用
            ipcRenderer.send("test", "ping");
        },
        on: () => { // メインプロセスからの受信用
            ipcRenderer.on("receive", function(){
                console.log("メインからなんかきた")
            });
        }
        // send: (channel, data) => { // レンダラーからの送信用
        // ipcRenderer.send(channel, data);
        // },

        // on: (channel, func) => { // メインプロセスからの受信用
        // ipcRenderer.on(channel, (event, ...args) => func(...args));
        // }
    }
);