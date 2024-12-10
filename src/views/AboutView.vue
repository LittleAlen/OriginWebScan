<template>
  <h1>Origin--漏洞扫描工具介绍</h1>
  Title: <input id="title" v-model="val" />
    <button id="btn" type="button" @click="k">Set</button>
    <p>测试输出</p>
      <el-input
        v-model="text"
        :rows="2"
        type="textarea"
        placeholder="Please input"
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