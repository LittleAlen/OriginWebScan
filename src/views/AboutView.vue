<template>
  <h1>Origin--WEB漏洞扫描工具介绍</h1>
  Title: <input id="title" v-model="val" />
    <button id="btn" type="button" @click="k">Set</button>
    
</template>
<script setup>
import {ref} from 'vue'
// const {ipcRenderer} = window.electron
var val=ref("origindd")
function k(){
  // console.log(window.electronAPI)
  // window.electronAPI.setTitle(val.value)
  //window.electron.ipcRenderer.send("set-title",val.value)
   window.electron.setTitle(val.value)

}
</script>