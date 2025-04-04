<!--
 * @Author: diaochan
 * @Date: 2025-04-03 17:12:12
 * @LastEditors: diaochan
 * @LastEditTime: 2025-04-04 09:25:52
 * @Description: 
-->
<template>
  <div class="app-container">
    <router-view />
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="cash-back-record" to="/" name="home">Single Transfer</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/batch" name="batch">Batch Transfer</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const active = ref(route.path === '/batch' ? 'batch' : 'home');
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #f5f5f5;
}

.app-container {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #ffffff;
  padding-bottom: 50px; /* 为底部导航栏预留空间 */
  box-sizing: border-box;
}
</style> 