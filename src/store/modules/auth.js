import AuthService from '../../services/auth.service';
import Cookies from 'js-cookie';

export const auth = {
    namespaced: true,
    state: () => ({
        loading: false,
        error: null,
        role: null,
        userInfo: null,
    }),
    actions: {
        async login({commit}, {login, password}) {
            try {
                commit('setError', null);
                commit('setLoading', true);
                const token = await AuthService.getToken({login, password});
                Cookies.set('token', token);
                const userInfo = await AuthService.getUserInfo();
                Cookies.set('role', userInfo.data.data.role);
                commit('setLoading', false);
            } catch (error) {
                commit('setLoading', false);
                commit('setError', error.response?.data?.message || error.message || error.toString());
            }
        },
        logout({commit}) {
            commit('loginFailure');
            Cookies.remove('token');
            Cookies.remove('role');
        },
    },
    mutations: {
        setLoading(state, bool) {
            state.loading = bool;
        },
        setError(state, error) {
            state.error = error;
        },
        loginSuccess(state, user) {
            state.role = user.role;
            state.userInfo = user;
        },
        loginFailure(state) {
            state.role = null;
            state.user = null;
        },
        logout(state) {
            state.role = null;
            state.user = null;
        },
    },
};
