import authService from '@/services/auth.service';
import licenseService from '@/services/license.service';

export const userModule = {
    state: () => ({
        user: null,
        licenseInfo: null,
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
        getLicenseInfo(state) {
            return state.licenseInfo;
        }
    },
    mutations: {
        setUser(state, arg) {
            state.user = arg;
        },
        setLicense(state, arg) {
            state.licenseInfo = arg;
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
        async fetchLicenseInfo({commit}) {
            try {
                const license = await licenseService.getLicense();
                if (license && license.expires_at) {
                    commit('setLicense', license);
                }
            } catch(e) {
                console.log(e);
            }
        }
    },
    namespaced: true,
};
