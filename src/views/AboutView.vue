<template>
  <h1>Origin-Web漏洞扫描工具</h1>
  
  <p>
      Origin是面向漏洞规则管理的Web漏扫工具
      <br> 支持用户自定义扫描脚本，上传脚本后，可通过源代码、运行输出来编辑调试
      <br>支持收录各个Web漏洞的playload于resource文件夹，然后通过js调用
  </p>


  <el-divider />
  小彩蛋: <input id="title" v-model="val" />
    <button id="btn" type="button" @click="k">Set</button>
    <p></p>
      <el-input
        v-model="text"
        :rows="2"
        type="textarea"
        readonly
      />




</template>
<script setup>
import {ref} from 'vue'
// const {ipcRenderer} = window.electron
var val=ref("")
var text=ref("")

window.electron.testText((_event,value)=>{
  text.value=text.value+"\n"+value
})
function k(){
  // console.log(window.electronAPI)
  // window.electronAPI.setTitle(val.value)
  //window.electron.ipcRenderer.send("set-title",val.value)
   window.electron.setTitle(val.value)

}
</script>