<template>

  <el-tree
    :data="treeData"
    :props="defaultProps"
    @node-click="handleNodeClick"
    default-expand-all
    :expand-on-click-node="false"
   
   
  >
  <template  #default="{ node, data }">
        <span  class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button v-if="enableDelete&&data.path!=='undeletable'" type="info" :icon="Delete"  @click="handleRemove(node,data)" link></el-button>
          </span>
        </span>
  </template>
  </el-tree>

  <el-dialog
    v-model="dialogVisible"
    :title=deleteName
    width="300"
  >
    <span>确定要删除该{{storeFile.data.filetype==="file"?"文件":"文件夹"}}吗？</span>
  
    <template #footer>
      <div class="dialog-footer">
       
        <el-button type="primary" @click="handleRemoveNode">
          是
        </el-button>
        <el-button @click="dialogVisible = false">否</el-button>
      </div>
    </template>
  </el-dialog>

</template>




<script setup>
import { ref, watch ,reactive, onMounted} from 'vue'
import {Delete,Edit,UploadFilled, View,Hide} from '@element-plus/icons-vue'
// 接收父组件传递的文件路径 prop
const {targetDir,enableDelete}=defineProps({
  targetDir: {
    type:String,
    required: true,
    default:"scripts"
  },
  enableDelete: {
    type:Boolean,
    required: true,
    default:false
  }

})

const emit = defineEmits(['FileClick'])

defineExpose({
  LoadFile
})

var dialogVisible = ref(false)
var deleteName = ref("None")
var treeData = ref([])  // 用于存储解析后的树状数据
const defaultProps = {
  children: 'children',
  label: 'name'
}



// 用于更新和获取文件夹内的文件列表
async function LoadFile() {
  try {
    // 你可以通过 API 或其他方式获取文件夹内的文件，这里假设是一个静态示例
    var dirpath=await window.electron.getDirname();

    var res=await window.electron.scanDir(dirpath+'/src/'+targetDir)

    var files = [{name:targetDir,path:"undeletable",children:res}]
    // 将文件数据转为树结构
    treeData.value = files
  } catch (error) {
    console.error('Error loading files:', error)
  }
}

onMounted(LoadFile)


var storeFile={node:null,data:null}

function handleRemove(node,data){
  deleteName.value=data.name
  dialogVisible.value=true
  storeFile.node=node
  storeFile.data=data
  
}

async function handleRemoveNode () {
  dialogVisible.value=false
  const node=storeFile.node
  const data=storeFile.data
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.path === data.path)
  children.splice(index, 1)
  await window.electron.deleteFile(data.path)
  //照理说这里应该更新一下响应式对象，但是因为el-tree本身是基于树的节点构建的，如果节点发生了变化会自动更新对象
  //treeData.value=[...treeData.value]
}

// 处理点击节点，返回点击的文件内容
function handleNodeClick (data) {
 
  if(data.filetype==="file")
    emit('FileClick',  data.path)
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
}
</style>

