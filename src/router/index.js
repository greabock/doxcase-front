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
// import FileLinkPage from '@/pages/FileLinkPage';

const routes = [
    {
        path: '/:pathMatch(.*)*',
        components: {default: NotFoundPage},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    {
        path: '/',
        name: 'HomePageRoute',
        components: {default: HomePage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    {
        path: '/auth',
        name: 'AuthPageRoute',
        components: {default: AuthPage},
        meta: {title:'Doxcase'}
    },
    {
        path: '/oauth/login',
        name: 'AzurePageRoute',
        components: {default: AzurePage},
        meta: {title:'Doxcase'}
    },
    {
        path: '/profile',
        name: 'ProfilePageRoute',
        components: {default: ProfilePage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    {
        path: '/search',
        name: 'SearchPageRoute',
        components: {default: SearchPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    {
        path: '/search/:id',
        name: 'SectionSearchPage',
        components: {default: SectionSearchPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    {
        path: '/sections',
        name: 'SectionListPageRoute',
        components: {default: SectionsListPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: [adminGuard, authGuard],
        meta: {title:'Doxcase'}
    },
    {
        path: '/section-creation',
        name: 'SectionCreationPageRoute',
        components: {default: SectionCreationPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: [adminGuard, authGuard],
        meta: {title:'Doxcase'}
    },
    {
        path: '/sections/:id',
        name: 'SectionPageRoute',
        components: {default: SectionPage, header: HeaderComponent, footer: FooterComponent,},
        beforeEnter: [adminGuard, authGuard],
        meta: {title:'Doxcase'}
    },
    {
        path: '/material-creation',
        name: 'MaterialSectionCreationPageRoute',
        components: {default: MaterialCreationPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: [authGuard],
        meta: {title:'Doxcase'}
    },
    {
        path: '/material-creation/:sectionId',
        name: 'MaterialCreationPageRoute',
        components: {default: MaterialCreationPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    {
        path: '/material-edit/:sectionId/:materialId',
        name: 'MaterialEditPageRoute',
        components: {default: MaterialCreationPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    {
        path: '/sections/:sectionId/material/:materialId',
        name: 'MaterialItemPageRoute',
        components: {default: MaterialPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    {
        path: '/forbidden',
        name: 'ForbiddenPageRoute',
        components: {default: ForbiddenPage, header: HeaderComponent, footer: FooterComponent},
        beforeEnter: authGuard,
        meta: {title:'Doxcase'}
    },
    // {
    //     path: '/file-link/:link',
    //     name: 'FileLinkPageRoute',
    //     components: {default: FileLinkPage, header: HeaderComponent, footer: FooterComponent},
    //     beforeEnter: authGuard,
    //     meta: {title:'База знаний'}
    // }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})