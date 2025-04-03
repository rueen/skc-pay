/*
 * @Author: diaochan
 * @Date: 2025-04-03 17:12:22
 * @LastEditors: diaochan
 * @LastEditTime: 2025-04-03 23:20:10
 * @Description: 
 */
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Transfer.vue'),
    meta: { title: '代付交易' }
  },
  {
    path: '/batch',
    name: 'BatchTransfer',
    component: () => import('@/views/BatchTransfer.vue'),
    meta: { title: '批量代付交易' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '代付交易系统';
  next();
});

export default router; 