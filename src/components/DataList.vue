<template>
    <el-table v-loading="loading" :data="tableData"
     :default-sort="{ prop: 'grade', order: 'descending' }" 
    height="250" style="width: 100%">
      <el-table-column prop="name" label="漏洞名称" align="center" />
      <el-table-column prop="grade" label="危险等级" align="center" >
        <!-- <template v-slot="scope">
          <el-rate v-model="scope.row.grade" colors="DCDCDC" disabled disabled-void-color="000000"  />
        </template> -->
      </el-table-column>

      <el-table-column prop="url" label="网页"  align="center" />
      <el-table-column prop="method" label="方法" align="center"  />
      <el-table-column label="操作"  align="center">
        <template v-slot="scope">
          <el-button type="info" :icon="Search"  @click="check(scope.row)" link>查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row >
    <el-col :span="1"><div class="grid-content ep-bg-purple" /><el-button type="primary" :icon="Document" >导出</el-button></el-col>
    <el-col :span="4" :offset="14"  ><div class="grid-content ep-bg-purple" /><el-button disabled type="info" :icon="Cloudy" >{{ hostname }}</el-button></el-col>
    </el-row>
    <el-dialog
    v-model="dialogVisible"
    title="漏洞报告"
    width="300"
    height="500"
    >
    <span>漏洞名字: {{ output.name }}        请求方法: {{ output.method }}</span><br><br>
    <span>网址url: {{output.url }}</span><br><br>
    <span>触发方法: </span><br>
    <el-input  :rows="4" type="textarea" v-model="output.triggerway" autocomplete="off" readonly/>
    <span>修复意见: </span><br>
    <el-input  :rows="4" type="textarea" v-model="output.suggestion" autocomplete="off" readonly/>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
  </template>
  
  <script  setup>
  import {Document,Search,Cloudy} from '@element-plus/icons-vue'
  import {ref} from "vue"

  var output=ref({})
  var dialogVisible=ref(false)
  defineProps({
    tableData:Array,
    hostname:String,
    loading:Boolean
  })
  function check(row){
    output.value=row
   
    dialogVisible.value=true
  }


 


  // const tableData = [
  //   {
  //     date: '2016-05-07',
  //     name: 'Tom',
  //     address: 'No. 189, Grove St, Los Angeles',
  //   },
  // ]
  </script>
  