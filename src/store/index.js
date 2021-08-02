import {createStore} from 'vuex';
import {userModule} from '@/store/user.module';

export const store = createStore({
    modules: {
        user: userModule,
    },
});
