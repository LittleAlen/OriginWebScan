<template>
  <el-row :gutter="2">
    <el-col :span="10"><div class="grid-content ep-bg-purple" /><el-input v-model="url" placeholder="粘贴URL至此栏" :disabled="Disabled" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /><el-button type="primary" :icon="Edit" @click="CopyRequest">从剪切板导入</el-button></el-col>

    <el-col :span="4"><div class="grid-content ep-bg-purple" /><el-button type="primary" :icon="Document" >从文件导入</el-button></el-col>

    <el-col :span="4" v-show="!running" ><div class="grid-content ep-bg-purple" /><el-button  @click="start" type="success" :icon="SwitchButton" round >启动</el-button></el-col>
    <el-col :span="4" v-show="running" ><div class="grid-content ep-bg-purple" /><el-button @click="stop" type="danger" :icon="Eleme" round   >停止</el-button></el-col>

  </el-row>
  <el-row :gutter="2">
    <el-col :span="24"><div class="grid-content ep-bg-purple" /><DataList :table-data="tableData" :hostname="hostname" /></el-col>
  </el-row>

  <el-dialog v-model="ClipboardVisible" >
    <el-input  :rows="4" type="textarea" v-model="rawRequest" autocomplete="off" placeholder="粘贴原始请求到该栏（配合BurpSuite）" />
  </el-dialog>
  
  
</template>
<script  setup>
import DataList from "../components/DataList.vue"
import {Edit,Document,SwitchButton,Loading, Eleme } from "@element-plus/icons-vue"
import {computed, ref} from "vue"

var running=ref(false)
var ClipboardVisible=ref(false)
var url=ref("http://127.0.0.1:8080")
//var url=ref("http://127.0.0.1:8080/vul/sqli/sqli_search.php?name=ede&submit=%E6%90%9C%E7%B4%A2")
var tableData=ref([])
var rawRequest=ref("")
var hostname=ref("www.xxx.com")

var Disabled=computed(()=> rawRequest.value !=="")


async function start(){
  running.value=true
  console.log("start")
  var result= await window.electron.start(url.value,rawRequest.value,"")
  
  // console.log(result)
  hostname.value=result[0]+"    个数："+result[1].length
  tableData.value=result[1].sort((a,b) => b.grade-a.grade)
  // console.log(tableData)
  // for(let i=0;i<result)

  running.value=false
  //todo
  }
async function stop(){
  running.value=false
  console.log("stop")
  await window.electron.stop()
}

async function CopyRequest(){
  ClipboardVisible.value=true
}
async function handleConfirm(){
  ClipboardVisible.value = false

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
