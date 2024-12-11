<template>

  <el-tree
    :data="treeData"
    :props="defaultProps"
    @node-click="handleNodeClick"
    default-expand-all
    :expand-on-click-node="false"
    style="max-height: 600px; overflow-y: auto;" 
  >
  <template v-if="enableDelete"  #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="info" :icon="Delete"  @click="handleRemove(node,data)" link></el-button>
          </span>
        </span>
  </template>
  </el-tree>

  <el-dialog
    v-model="confirmDelete"
    :title=deleteName
    width="300"
  >
    <span>确定要删除该文件吗？</span>
  
    <template #footer>
      <div class="dialog-footer">
       
        <el-button type="primary" @click="handleRemoveNode">
          是
        </el-button>
        <el-button @click="confirmDelete = false">否</el-button>
      </div>
    </template>
  </el-dialog>

</template>




<script setup>
import { ref, watch ,reactive, onMounted} from 'vue'
import {Delete,Edit,UploadFilled, View,Hide} from '@element-plus/icons-vue'
// 接收父组件传递的文件路径 prop
const {dirpath,enableDelete}=defineProps({
  dirpath: {
    type:String,
    required: true,
    default:"@/src/xxx"
  },
  enableDelete: {
    type:Boolean,
    required: true,
    default:false
  }

})

const emit = defineEmits(['FileClick'])

var confirmDelete = ref(false)
var deleteName = ref("None")
var treeData = ref([ { name: 'file1.txt', path: `file1.txt` }])  // 用于存储解析后的树状数据
const defaultProps = {
  children: 'children',
  label: 'name'
}



// 用于更新和获取文件夹内的文件列表
function LoadFile(folderPath) {
  try {
    // 你可以通过 API 或其他方式获取文件夹内的文件，这里假设是一个静态示例
    var files = [
      { name: 'file1.txt', path: `${folderPath}/file1.txt` },
      { name: 'file2.txt', path: `${folderPath}/file2.txt` },
      { name: 'file3.txt', path: `${folderPath}/file3.txt` },
      { name: 'file4.txt', path: `${folderPath}/file4.txt` },
      { name: 'file5.txt', path: `${folderPath}/file5.txt` },
      { name: 'file6.txt', path: `${folderPath}/file6.txt` },
      { name: 'file7.txt', path: `${folderPath}/file7.txt` },
      { name: 'file8.txt', path: `${folderPath}/file8.txt` },
      { name: 'subfolder', path: `${folderPath}/subfolder`, children: [
          { name: 'file9.txt', path: `${folderPath}/subfolder/file9.txt` },
          { name: 'file10.txt', path: `${folderPath}/subfolder/file10.txt` }
        ]
      }
    ]
     
    
    // 将文件数据转为树结构
    treeData.value = files
  } catch (error) {
    console.error('Error loading files:', error)
  }
}

onMounted(()=> LoadFile(dirpath))


var store_file={node:null,data:null}
var store_file1={node:undefined,data:null}
function handleRemove(node,data){
  deleteName.value=data.name
  confirmDelete.value=true
  console.log(store_file)
  store_file.node=node
  store_file.data=data
  
}

function handleRemoveNode () {
  confirmDelete.value=false
  const node=store_file.node
  const data=store_file.data
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.name === data.name)
  children.splice(index, 1)
  //照理说这里应该更新一下响应式对象，但是因为el-tree本身是基于树的节点构建的，如果节点发生了变化会自动更新对象
  //treeData.value=[...treeData.value]
}

// 处理点击节点，返回点击的文件内容
function handleNodeClick (node) {
  const filePath = node.path
  emit('FileClick', filePath)
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>


<!-- <template>
  <div class="custom-tree-container">
    <p>Using scoped slot</p>
    <el-tree
   
       style="max-height: 600px; overflow-y: auto;" 
      :data="dataSource"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a @click="append(data)"> Append </a>
            <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'


let id = 1000

const append = (data) => {
  const newChild = { id: id++, label: 'testtest', children: [] }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
}

const remove = (node, data) => {
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}


const dataSource = ref([
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
])
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style> -->