import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/2d/Meta2d.vue') },
  { path: '/2d', component: () => import('../views/2d/Meta2d.vue') },
  // { path: '/3d', component: () => import('../views/3d/Meta3d.vue') },
];
const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
