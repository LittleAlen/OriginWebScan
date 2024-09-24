<template>
  <nav>
    <el-tabs v-model="activeName" class="demo-tabs" >
    <el-tab-pane label="主页" name="first" ><HomeView /></el-tab-pane>
    <el-tab-pane label="配置" name="second"><ConfigView /></el-tab-pane>
    <el-tab-pane label="源代码" name="third"><AboutView /></el-tab-pane>
    <el-tab-pane label="运行输出" name="fourth">Alenkz12</el-tab-pane>
    <!-- <el-tab-pane label="脚本库" name="fourth">Alenkz12</el-tab-pane> -->

    </el-tabs>
  </nav>
  <!-- <router-view></router-view> -->
</template>
<script  setup>
import {ref} from 'vue'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'
import ConfigView from './views/ConfigView.vue'

var activeName=ref("first")
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
