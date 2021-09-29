import authService from '@/services/auth.service';
import licenseService from '@/services/license.service';

export const userModule = {
    state: () => ({
        user: null,
        licenseExpiresAt: null
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
        setExpiresAt(state, arg) {
            state.licenseExpiresAt = arg;
        }
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
        async fetchLicenseExpiresAt({commit}) {
            try {
                const license = await licenseService.getLicense();
                if (license && license.expires_at) {
                    commit('setExpiresAt', license.expires_at);
                }
            } catch(e) {
                console.log(e);
            }
        }
    },
    namespaced: true,
};
