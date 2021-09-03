import {createApp, h} from 'vue';

import App from './App.vue';
import {store} from '@/store';
import {router} from '@/router';

import Notifications from '@kyvg/vue3-notification'

const app = createApp({
    render: () => h(App),
});

app.use(store);
app.use(router);
app.use(Notifications)

app.mount('#app');
