import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/editor',
      name: 'editor',
      props: route => ({ image: route.params.image }),
      // route level code-splitting
      // this generates a separate chunk (editor.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "editor" */ './views/Editor.vue'),
    },
  ],
});
