const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  testText:(callback)=>ipcRenderer.on('text',callback), //这个表示事件直接在浏览器处理，不需要和nodejs交互
  start:(url,rawRequest,filePath)=>ipcRenderer.invoke("Start",url,rawRequest,filePath),
  stop:()=>ipcRenderer.invoke("Stop"),
  getRules:()=>ipcRenderer.invoke("GetRules"),
  storeRules:(rules)=>ipcRenderer.invoke("StoreRules",rules),
  deleteFile:(path)=>ipcRenderer.send("DeleteFile",path),
  getFile:(path)=>ipcRenderer.invoke("GetFile",path),
  storeFile:(path,buffer)=>ipcRenderer.send("StoreFile",path,buffer),
  moveFile:(srcpath,despath)=>ipcRenderer.send("MoveFile",srcpath,despath),
  setControlStatus:(status)=>ipcRenderer.send("SetControlStatus",status),
  getDirname:()=>ipcRenderer.invoke("GetDirpath"),
  scanDir:(dirpath)=>ipcRenderer.invoke("ScanDirectory",dirpath),

})

