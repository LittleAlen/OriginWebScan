<template>
    <div >
      <el-row :gutter="2">
        <!-- 左侧文件栏 -->
        <el-col :span="8">
          <FileList @file-click="onFileClick" dirpath="@/scripts" ></FileList>
      
        </el-col>
        
        <!-- 右侧文本框 -->
        <el-col :span="16">
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

  