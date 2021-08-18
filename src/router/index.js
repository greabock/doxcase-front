import {createRouter, createWebHistory} from 'vue-router';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import NotFoundPage from '@/pages/NotFoundPage';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import SearchPage from '@/pages/SearchPage';
import MaterialCreationPage from '@/pages/MaterialCreationPage';
import SectionsListPage from '@/pages/SectionsListPage';
import SectionCreationPage from '@/pages/SectionCreationPage';
import SectionPage from '@/pages/SectionPage';
import MaterialPage from '@/pages/MaterialPage';
import {adminGuard} from '@/guards/admin.guard';

const routes = [
    {
        path: '/:pathMatch(.*)*',
        components: {default: NotFoundPage},
    },
    {
        path: '/',
        name: 'HomePageRoute',
        components: {default: HomePage, header: HeaderComponent, footer: FooterComponent},
    },
    {
        path: '/auth',
        name: 'AuthPageRoute',
        components: {default: AuthPage},
    },
    {
        path: '/profile',
        name: 'ProfilePageRoute',
        components: {default: ProfilePage, header: HeaderComponent, footer: FooterComponent},
    },
    {
        path: '/search',
        name: 'SearchPageRoute',
        components: {default: SearchPage, header: HeaderComponent, footer: FooterComponent},
    },
    {
        path: '/sections',
        name: 'SectionListPageRoute',
        components: {default: SectionsListPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: adminGuard,
    },
    {
        path: '/section-creation',
        name: 'SectionCreationPageRoute',
        components: {default: SectionCreationPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: adminGuard,
    },
    {
        path: '/sections/:id',
        name: 'SectionPageRoute',
        components: {default: SectionPage, header: HeaderComponent, footer: FooterComponent,},
        beforeEnter: adminGuard,
    },
    {
        path: '/material-creation',
        name: 'MaterialCreationPageRoute',
        components: {default: MaterialCreationPage, header: HeaderComponent, footer: FooterComponent},
    },
    {
        path: '/sections/:sectionId/material/:materialId',
        name: 'MaterialItemPageRoute',
        components: {default: MaterialPage, header: HeaderComponent, footer: FooterComponent},
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
