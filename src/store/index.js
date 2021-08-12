import {createStore} from 'vuex';
import {userModule} from '@/store/user.module';
import {sectionsModule} from '@/store/sections.module';

export const store = createStore({
    modules: {
        user: userModule,
        sections: sectionsModule,
    },
});
