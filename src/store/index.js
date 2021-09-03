import {createStore} from 'vuex';
import {userModule} from '@/store/user.module';
import {sectionsModule} from '@/store/sections.module';
import {searchModule} from '@/store/search.module';

export const store = createStore({
    modules: {
        user: userModule,
        sections: sectionsModule,
        search: searchModule,
    },
});
