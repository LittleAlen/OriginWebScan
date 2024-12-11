<template>
    <div >
      <el-row :gutter="2">
        <!-- 左侧文件栏 -->
        <el-col :span="8">
          <el-row :gutter="5">
            
            <el-col :span="24">文件目录</el-col>
          </el-row>
          <br>
          <div  style="max-height: 63%; overflow-y: auto;" >
            <FileList ref="rc" @file-click="onFileClick" target-dir="resource" :enable-delete="true" ></FileList>
            <FileList @file-click="onFileClick" target-dir="scripts" :enable-delete="false" ></FileList>
          </div>
          
      
        </el-col>
        
        <!-- 右侧文本框 -->
        <el-col :span="16">
          <el-row :gutter="2">
            <el-col :span="12">
              <el-button type="primary" @click="dialogVisible=!dialogVisible">上传文件</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="handleStoreFile">保存文件</el-button>
            </el-col>
          </el-row>
          
            <el-input
                type="textarea"
                v-model="fileContent"
                rows="20"
                placeholder="点击左侧文件可查看内容并编辑"
            />
        </el-col>
      </el-row>
    </div>

    <el-dialog v-model="dialogVisible">
      <el-upload
        v-model:file-list="fileList"
        drag
        multiple
        :auto-upload="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件 or<em> 点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip" >
            上传文件至resource文件夹，zip文件会自动解压
          </div>
        </template>
      </el-upload>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">
          确认
        </el-button>
      </span>
    </template>
    </el-dialog>

  </template>
  
<script setup>

import FileList from '@/components/FileList.vue'
import { ElMessage } from 'element-plus';
import {computed, reactive, ref, watchEffect} from "vue"
import { UploadFilled } from '@element-plus/icons-vue'


var fileList = ref([])

var filepath=""
var fileContent=ref("")
var dialogVisible=ref(false)
var storeContent=""
var rc=ref()
async function onFileClick(path) {
  filepath = path
  var tmp= await window.electron.getFile(filepath)
  storeContent = new TextDecoder('utf-8').decode(tmp.buffer)
  fileContent.value=storeContent
}
async function  handleStoreFile() {
  if(storeContent===fileContent.value){
    ElMessage({
      message:"文件内容没有变化～",
      type:"info"
    })
  }else{
    try{
      var data=new TextEncoder().encode(fileContent.value).buffer
      await window.electron.storeFile(filepath,data)
      ElMessage({
      message:"文件保存成功",
      type:"success"
      })
      storeContent=fileContent.value
    }catch(e){
      console.log(e)
      ElMessage({
      message:"文件保存失败",
      type:"error"
      })
    }
  }

}

async function handleConfirm(){
  var dirname= await window.electron.getDirname()+"/src/resource/"
  fileList.value.forEach(async (fileObj)=>{
    try{ 
      var file=fileObj.raw
      console.log(file)
      await window.electron.moveFile(file.path,dirname+file.name)
      ElMessage({
        message:"文件上传成功",
        type:"success"
      })
    }catch(err){
      ElMessage({
      message:"文件上传失败",
      type:"error"
      })
      console.log(err)
    }
  })
  dialogVisible.value=false
  rc.value.LoadFile()
  fileList.value=[]
}

async function handleCancel() {
    fileList.value=[] 
    dialogVisible.value=false
}

</script>

  