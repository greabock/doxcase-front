import {createRouter, createWebHistory} from 'vue-router';

import Header from '@/components/Header.vue';
import NotFound from '@/pages/common/NotFound.vue';
import Home from '@/pages/home/Index.vue';
import Login from '@/pages/auth/Index.vue';
import Profile from '@/pages/profile/Index.vue';

const routes = [
    {path: '/:pathMatch(.*)*', components: {default: NotFound}},
    {path: '/', name: 'home', components: {default: Home, header: Header}},
    {path: '/login', name: 'login', components: {default: Login}},
    {path: '/profile', name: 'profile', components: {default: Profile, header: Header}},
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.path !== '/login' && !token) {
        next('/login');
    } else {
        next();
    }
});
