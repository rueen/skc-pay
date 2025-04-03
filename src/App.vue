<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup>
// App级别逻辑
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
}
</style> 