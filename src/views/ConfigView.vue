<template>
    <el-row :gutter="2">
        <el-col :offset="1" :span="16"><div class="grid-content ep-bg-purple" /><el-input v-model="item" placeholder="查询规则名" /></el-col>
        <el-col :span="7"><div class="grid-content ep-bg-purple" /><el-button type="primary" :icon="Plus" @click="add">添加</el-button></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24"><div class="grid-content ep-bg-purple" /><RuleList @delete-row="handleDeleteRow" @update-row="handleUpdateRow" @enable-row="handleEnableRow"    :rules-data="rulesShow" /></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="12">
        <el-switch
      v-model="scan_all"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #26ceec"
      active-text="全域扫描"
      inactive-text="单页扫描"
        />
      </el-col>
      <el-col :span="12">
        <el-switch
      v-model="static_render"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #26ceec"
      active-text="静态渲染"
      inactive-text="动态渲染"
        />
      </el-col>
    </el-row>
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
  import RuleList from "../components/RuleList.vue"
  import { Search,Plus,UploadFilled } from "@element-plus/icons-vue"
  import {computed, ref,reactive,onMounted,onUnmounted,onDeactivated,watch, watchEffect} from "vue"

  var rulesData=reactive([])
  var item=ref("")
  var scan_all=ref(false)
  var static_render=ref(true)
  // var rulesShow=ref([])
  var rulesShow=computed(()=>{
    if(item.value=="")
    {
        return rulesData.sort((a,b)=>b.grade-a.grade)
    }else{
        var tmp=[]
        for(let i=0;i<rulesData.length;i++){
            if(rulesData[i].name.includes(item.value))
                tmp.push(rulesData[i])
        }
        return tmp.sort((a,b)=>b.grade-a.grade)
    }
  })
  watch(()=>{
    window.electron.setControlStatus([false,scan_all.value,static_render.value])
  })
  var dialogVisible=ref(false)
  var form = reactive({ id:0,
        name:"",
        grade:1,
        method:"",
        suggestion:"",
        path:"",
        status:true,
      })
  defineProps({
    rulesData:Array
  })

  
  function add(){
    let ma=-1
    for(let i=0;i<rulesData.length;i++)
        ma=ma>rulesData[i].id ?ma:rulesData[i].id
    form.id=ma+1

    dialogVisible.value=true
  }
 
  
  async function handleCancel(){
    form.name=""
    form.grade=1
    form.method=""
    form.suggestion=""
    if(form.path!==""){
       await window.electron.deleteScript(form.path)
    }
    form.path=""
    dialogVisible.value=false
  }
  async function handleConfirm(){
    var res=JSON.parse(JSON.stringify(form))
    rulesData.push(res)
    await updateRulesData()
    form.name=""
    form.grade=1
    form.method=""
    form.suggestion=""
    form.path=""
    dialogVisible.value=false
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
    async function handleUpdateRow(form){
      for(let i=0;i<rulesData.length;i++){
            //console.log(rulesData[i])
            if(rulesData[i].id==form.id){
                rulesData[i]=form
                break
            }
        }
      await updateRulesData()
    }
    async function handleDeleteRow(id){
        for(let i=0;i<rulesData.length;i++){
            //console.log(rulesData[i])
            if(rulesData[i].id==id){
                await window.electron.deleteScript(rulesData[i].path)
                rulesData.splice(i,1)
                break
            }
          
        }
        
       // await window.electron.storeRules(JSON.parse(JSON.stringify(rulesData)))
        await updateRulesData()
        
    }
    async function handleEnableRow(id){
      for(let i=0;i<rulesData.length;i++){
            //console.log(rulesData[i])
            if(rulesData[i].id==id){
               rulesData[i].status=!rulesData[i].status
               break;
            }
        }
      await updateRulesData()
    }
  // async function updateRulesShow(){
    // if(item.value=="")
    // {
    //     rulesShow.value = rulesData
    // }else{
    //     var tmp=[]
    //     for(let i=0;i<rulesData.length;i++){
    //         if(rulesData[i].name.includes(item.value))
    //             tmp.push(rulesData[i])
    //     }
    //     rulesShow.value=tmp
    // }
  // }  
  async function updateRulesData(){
    await window.electron.storeRules(JSON.parse(JSON.stringify(rulesData)))
  }
  
  onMounted(async ()=>{
    var result= await window.electron.getRules()
    // console.log(result)
    for(let i=0;i<result.length;i++){
      rulesData.push(result[i])
    }

    // await updateRulesShow()
  })
 


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
  