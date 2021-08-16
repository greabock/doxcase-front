import authService from '@/services/auth.service';

export const userModule = {
    state: () => ({
        user: null,
    }),
    getters: {
        getUser(state) {
            return state.user;
        },
        getUserAvatar(state) {
            if (state.user && state.user.avatar) {
                return state.user.avatar;
            }
            return '/img/@1x/avatar-2.png';
        },
    },
    mutations: {
        setUser(state, arg) {
            state.user = arg;
        },
    },
    actions: {
        async fetchUserData({commit}) {
            try {
                const user = await authService.getUserInfo();
                commit('setUser', user);
            } catch (e) {
                console.log(e);
            }
        },
    },
    namespaced: true,
};
