import authService from '@/services/auth.service';
import licenseService from '@/services/license.service';
import {defineIsEditAllowed} from '@/utils/date.helpers';

export const userModule = {
    state: () => ({
        user: null,
        licenseInfo: null,
        isEditAllowed: true
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
        },
        getIsEditAllowed(state) {
            return state.isEditAllowed;
        }
    },
    mutations: {
        setUser(state, arg) {
            state.user = arg;
        },
        setLicense(state, arg) {
            state.licenseInfo = arg;
        },
        setIsEditAllowed(state, arg) {
            state.isEditAllowed = arg;
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
                if (license && license.expires_at && license.current_date) {
                    commit('setLicense', license);
                    commit('setIsEditAllowed', defineIsEditAllowed(license.expires_at, license.current_date));
                }
            } catch(e) {
                console.log(e);
            }
        }
    },
    namespaced: true,
};
