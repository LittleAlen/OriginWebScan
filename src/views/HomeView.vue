<template>
  <el-row :gutter="2">
    <el-col :span="10"><div class="grid-content ep-bg-purple" /><el-input v-model="url" placeholder="粘贴URL至此栏" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /><el-button type="primary" :icon="Edit">从剪切板导入</el-button></el-col>

    <el-col :span="4"><div class="grid-content ep-bg-purple" /><el-button type="primary" :icon="Document" >从文件导入</el-button></el-col>

    <el-col :span="4" v-show="!running" ><div class="grid-content ep-bg-purple" /><el-button  @click="start" type="success" :icon="SwitchButton" round >启动</el-button></el-col>
    <el-col :span="4" v-show="running" ><div class="grid-content ep-bg-purple" /><el-button @click="stop" type="danger" :icon="Loading" round  >停止</el-button></el-col>

  </el-row>
  <el-row :gutter="2">
    <el-col :span="24"><div class="grid-content ep-bg-purple" /><DataList /></el-col>
  </el-row>

  
  
</template>
<script  setup>
import DataList from "../components/DataList.vue"
import {Edit,Document,SwitchButton,Loading } from "@element-plus/icons-vue"
import {ref} from "vue"
var running=ref(false)
var url=ref("")
function start(){
  running.value=true
  console.log("start")
  //todo
  }
function stop(){
  running.value=false
  console.log("stop")
  //todo
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
