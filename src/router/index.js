import {createRouter, createWebHistory} from 'vue-router';

import Header from '@/components/Header.vue';
import Footer from '@/components/Footer';
import NotFound from '@/pages/common/NotFound.vue';
import Home from '@/pages/home/Index.vue';
import Auth from '@/pages/auth/Index.vue';
import Profile from '@/pages/profile/Index.vue';
import Search from '@/pages/search';
import UserInfo from '@/pages/edit/userInfo';
import Edit from '@/pages/edit/edit';
import MaterialCreation from '@/pages/materialCreation';
import ChapterList from '@/pages/chapterList';
import ChapterCreation from '@/pages/chapterCreation';
import Material from '@/pages/material';

const routes = [
    {path: '/:pathMatch(.*)*', components: {default: NotFound}},
    {path: '/', name: 'home', components: {default: Home, header: Header}},
    {path: '/auth', name: 'auth', components: {default: Auth}},
    {path: '/profile', name: 'profile', components: {default: Profile, header: Header}},
    {path: '/search', name: 'search', components: {default: Search, header: Header, footer: Footer}},
    {
        path: '/edit',
        name: 'edit',
        components: {asideLeft: UserInfo, contentRight: Edit, header: Header, footer: Footer},
    },
    {
        path: '/material-creation',
        name: 'materialCreation',
        components: {default: MaterialCreation, header: Header, footer: Footer},
    },
    {
        path: '/chapter-list',
        name: 'chapterList',
        components: {default: ChapterList, header: Header, footer: Footer},
    },
    {
        path: '/chapter-creation',
        name: 'chapterCreation',
        components: {default: ChapterCreation, header: Header, footer: Footer},
    },
    {
        path: '/material/:id',
        name: 'material',
        components: {default: Material, header: Header, footer: Footer},
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.path !== '/auth' && !token) {
        next('/auth');
    } else {
        next();
    }
});
