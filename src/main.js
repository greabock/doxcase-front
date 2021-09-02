import {createApp, h} from 'vue';

import App from './App.vue';
import {store} from '@/store';
import {router} from '@/router';
import VIntersection from '@/directives/VIntersection';

import Notifications from '@kyvg/vue3-notification'

const app = createApp({
    render: () => h(App),
});

app.directive(VIntersection.name, VIntersection);

app.use(store);
app.use(router);
app.use(Notifications)

app.mount('#app');
