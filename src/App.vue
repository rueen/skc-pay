<template>
  <div class="app-container">
    <router-view />
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="cash-back-record" to="/" name="home">单笔代付</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/batch" name="batch">批量代付</van-tabbar-item>
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
}
</style> 