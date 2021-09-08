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
import SectionSearchPage from '@/pages/SectionSearchPage';
import {adminGuard, authGuard} from '@/guards/admin.guard';
import AzurePage from '@/pages/AzurePage';
import ForbiddenPage from '@/pages/ForbiddenPage';

const routes = [
    {
        path: '/:pathMatch(.*)*',
        components: {default: NotFoundPage},
        meta: {title:'База знаний'}
    },
    {
        path: '/',
        name: 'HomePageRoute',
        components: {default: HomePage, header: HeaderComponent, footer: FooterComponent},
        meta: {title:'База знаний'}
    },
    {
        path: '/auth',
        name: 'AuthPageRoute',
        components: {default: AuthPage},
        meta: {title:'База знаний'}
    },
    {
        path: '/profile',
        name: 'ProfilePageRoute',
        components: {default: ProfilePage, header: HeaderComponent, footer: FooterComponent},
        meta: {title:'База знаний'}
    },
    {
        path: '/search',
        name: 'SearchPageRoute',
        components: {default: SearchPage, header: HeaderComponent, footer: FooterComponent},
        meta: {title:'База знаний'}
    },
    {
        path: '/search/:id',
        name: 'SectionSearchPage',
        components: {default: SectionSearchPage, header: HeaderComponent, footer: FooterComponent},
        meta: {title:'База знаний'}
    },
    {
        path: '/sections',
        name: 'SectionListPageRoute',
        components: {default: SectionsListPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: adminGuard,
        meta: {title:'База знаний'}
    },
    {
        path: '/section-creation',
        name: 'SectionCreationPageRoute',
        components: {default: SectionCreationPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: adminGuard,
        meta: {title:'База знаний'}
    },
    {
        path: '/sections/:id',
        name: 'SectionPageRoute',
        components: {default: SectionPage, header: HeaderComponent, footer: FooterComponent,},
        beforeEnter: adminGuard,
        meta: {title:'База знаний'}
    },
    {
        path: '/material-creation',
        name: 'MaterialSectionCreationPageRoute',
        components: {default: MaterialCreationPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: [authGuard],
        meta: {title:'База знаний'}
    },
    {
        path: '/material-creation/:sectionId',
        name: 'MaterialCreationPageRoute',
        components: {default: MaterialCreationPage, header: HeaderComponent, footer: FooterComponent},
        meta: {title:'База знаний'}
    },
    {
        path: '/material-edit/:sectionId/:materialId',
        name: 'MaterialEditPageRoute',
        components: {default: MaterialCreationPage, header: HeaderComponent, footer: FooterComponent},
        meta: {title:'База знаний'}
    },
    {
        path: '/sections/:sectionId/material/:materialId',
        name: 'MaterialItemPageRoute',
        components: {default: MaterialPage, header: HeaderComponent, footer: FooterComponent},
        meta: {title:'База знаний'}
    },
    {
        path: '/forbidden',
        name: 'MaterialItemPageRoute',
        components: {default: ForbiddenPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: [authGuard],
        meta: {title:'База знаний'}
    }
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

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})