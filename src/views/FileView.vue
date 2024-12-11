<template>
    <div >
      <el-row :gutter="2">
        <!-- 左侧文件栏 -->
        <el-col :span="8">
          <el-row :gutter="5">
            
            <el-col :span="24">文件目录</el-col>
          </el-row>
          <br>
          <div>
            <FileList @file-click="onFileClick" dirpath="@/scripts" :enable-delete="true" ></FileList>
          <FileList @file-click="onFileClick" dirpath="@/resource" :enable-delete="false" ></FileList>
          </div>
          
      
        </el-col>
        
        <!-- 右侧文本框 -->
        <el-col :span="16">
          <el-row :gutter="2">
            <el-col :span="12">
              <el-button type="primary" @click="1">上传文件</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="1">保存文件</el-button>
            </el-col>
          </el-row>
          
            <el-input
                type="textarea"
                v-model="fileContent"
                rows="20"
                readonly
                placeholder="点击左侧文件查看内容"
            />
        </el-col>
      </el-row>
    </div>
  </template>
  
<script setup>

import FileList from '@/components/FileList.vue'
import {computed, ref} from "vue"


var fileContent=ref("")
async function onFileClick(content) {
  fileContent.value = content
}

</script>

  