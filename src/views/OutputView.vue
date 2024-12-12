<template>
  
  <el-input
        type="textarea"
        v-model="fileContent"
        rows="20"
        placeholder="后台运行输出"
        readonly
    />
  
  </template>
  <script setup>
  import {onBeforeUnmount, onMounted, ref} from 'vue'
  var fileContent=ref("")

  async function GetOutput(filepath){
    var tmp=await window.electron.getFile(filepath)
    fileContent.value=new TextDecoder('utf-8').decode(tmp.buffer)
  }
  var timer=""
  function formatDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}_${month}_${day}`;
  }
  onMounted(async()=>{
    var dirname = await window.electron.getDirname()
    //var filepath=`${dirname}/log/${formatDate()}_output.log`
    var filepath=`${dirname}/log/output.log`
    timer=setInterval(()=>{
      GetOutput(filepath)
    },5000)
  })
  onBeforeUnmount(()=>{
    clearInterval(timer)
  })

  </script>