<template>
    <el-table :data="tableData" height="250" style="width: 100%">
      <el-table-column prop="date" label="名称"  />
      <el-table-column prop="name" label="危险等级"  />
      <el-table-column prop="address" label="操作" />
    </el-table>
    <el-row>
    <el-col :span="1"><div class="grid-content ep-bg-purple" /><el-button type="primary" :icon="Document" >导出</el-button></el-col>
    </el-row>
  </template>
  
  <script  setup>
  import {Document} from '@element-plus/icons-vue'
  const tableData = [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-08',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-06',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-07',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ]
  </script>
  