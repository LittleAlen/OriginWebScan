<template>
    <el-table :data="rulesData" height="250" style="width: 100%">
      <el-table-column prop="name" label="漏洞名称" align="center"  />
      <el-table-column prop="grade" label="危险等级"  align="center" />
      <el-table-column prop="path" label="文件名" align="center" />

      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="info" :icon="Edit"  @click="edit(scope.row)" link>编辑</el-button>
          <el-button type="info" :icon="Delete"  @click="handleDeleteRow(scope.row.id,scope.row.name)" link>删除</el-button>
          <el-button type="info" :icon="View" v-show="scope.row.status"   @click="handleEnableRow(scope.row.id)" link>启用</el-button>
          <el-button type="info" :icon="Hide"  v-show="!scope.row.status"  @click="handleEnableRow(scope.row.id)" link>禁用</el-button>
          
        </template>
      
      </el-table-column>
    </el-table>
    
    <el-dialog
    v-model="confirmDelete"
    :title=deleteName
    width="300"
  >
    <span>确定要删除该条漏洞检测规则吗？</span>
  
    <template #footer>
      <div class="dialog-footer">
       
        <el-button type="primary" @click="handleConfirmDelete">
          是
        </el-button>
        <el-button @click="confirmDelete = false">否</el-button>
      </div>
    </template>
  </el-dialog>

    <el-dialog v-model="dialogVisible" title="规则添加">
    <el-form :model="form" :inline="true">
      <el-form-item label="漏洞名字" >
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="危险等级" >
        <el-input-number v-model="form.grade" :min="1" :max="5"  />
      </el-form-item>
      <el-form-item  label="触发方法" >
        <el-input  :rows="2" type="textarea" v-model="form.method" autocomplete="off" />
      </el-form-item>
      <el-form-item  label="修复建议" >
        <el-input :rows="2" type="textarea" v-model="form.suggestion" autocomplete="off" />
      </el-form-item>
      <el-form-item  label="js脚本" >
        <el-col :span="18">
            <el-input v-model="form.path" autocomplete="off" />
        </el-col> 
        <el-col :span="4" :offset="2">
            <el-button type="primary" @click="handleFileUpload" round>点击上传</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    
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
  
  <script  setup>
  import {Delete,Edit,UploadFilled, View,Hide} from '@element-plus/icons-vue'
  import {ref,reactive} from "vue"
  const emit = defineEmits(['DeleteRow','UpdateRow','EnableRow'])
  var dialogVisible=ref(false)
  var confirmDelete=ref(false)
  var deleteID=ref(-1)
  var deleteName=ref("None")
  var form = reactive({ id:0,
        name:"",
        grade:1,
        method:"",
        suggestion:"",
        path:"",
        status:"",
      })
  defineProps({
    rulesData:Array
  })
  function edit(row){
    form.name=row.name
    form.grade=row.grade
    form.id=row.id
    form.method=row.method
    form.suggestion=row.suggestion
    form.path=row.path
    form.status=row.status
    dialogVisible.value=true
  }
 
  
  async function handleFileUpload () {
    const arrFileHandle = await window.showOpenFilePicker({
        types: [{
            accept: {
                'application/javascript':[".js"]
            }
        }],
       
    });
    
    // 遍历选择的文件
    for (const fileHandle of arrFileHandle) {
        // 获取文件内容
        const fileData = await fileHandle.getFile();
        form.path=fileData.name
        fileData.text().then((text)=>{
            //console.log(text)
            window.electron.storeScript(fileData.name,text)
        })
        
    }
    }
  
  function handleDeleteRow(id,name){
    deleteID.value=id
    deleteName.value=name
    confirmDelete.value=true
  }
  function handleConfirmDelete(id){
    emit('DeleteRow',id)
  }
  function handleEnableRow(id){
    emit('EnableRow',id);
  }



  function handleCancel(){
    dialogVisible.value=false
  }
  function handleConfirm(){
    emit('UpdateRow',JSON.parse(JSON.stringify(form)))
    dialogVisible.value=false

  }


  </script>
  