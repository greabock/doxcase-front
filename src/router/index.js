import {createRouter, createWebHistory} from 'vue-router';

import Header from '@/components/Header.vue';
import NotFound from '@/views/common/NotFound.vue';
import Home from '@/views/home/Index.vue';
import Login from '@/views/auth/Index.vue';
import Profile from '@/views/profile/Index.vue';
import Cookies from 'js-cookie';

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
    const token = Cookies.get('token');
    if (to.path !== '/login' && !token) {
        next('/login');
    } else {
        next();
    }
});
