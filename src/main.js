import {createApp, h} from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import App from './App.vue';
import {store} from '@/store';
import {router} from '@/router';

const app = createApp({
    render: () => h(App),
});

app.use(store);
app.use(router);
app.use(ElementPlus);

app.mount('#app');
