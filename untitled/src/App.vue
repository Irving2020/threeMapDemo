<script setup lang="ts">
import index2 from "./components/index2.vue";
import index3 from "./components/index3.vue";
import index4 from "./components/index4.vue";
import {ref} from "vue";

const activeName = ref('index2')
</script>

<template>
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
    >
      <el-tab-pane label="index2" name="index2">
        <index2 v-if="activeName=='index2'"/>
      </el-tab-pane>
      <el-tab-pane label="index3" name="index3">
        <index3 v-if="activeName=='index3'"/>
      </el-tab-pane>
      <el-tab-pane label="index4" name="index4">
        <index4 v-if="activeName=='index4'"/>
      </el-tab-pane>
    </el-tabs>
    <index2/>
</template>

