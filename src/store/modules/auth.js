import AuthService from '../../services/auth.service';
import Cookies from 'js-cookie';

export const auth = {
    namespaced: true,
    state: {
        loading: false,
        error: null,
        isAuth: false,
    },
    actions: {
        async login({commit}, {login, password}) {
            try {
                commit('setLoading', true);
                const token = await AuthService.getToken({login, password});
                Cookies.set('token', token);
                const userInfo = await AuthService.getUserInfo();
                Cookies.set('role', userInfo.data.data.role);
                commit('loginSuccess');
            } catch (error) {
                commit('setError', error.response?.data?.message || error.message || error.toString());
            }
        },
        logout({commit}) {
            commit('logoutMut');
            Cookies.remove('token');
            Cookies.remove('role');
        },
    },
    mutations: {
        setLoading(state, bool) {
            state.loading = bool;
            state.error = null;
        },
        loginSuccess(state) {
            state.isAuth = true;
            state.loading = false;
            state.error = null;
        },
        setError(state, error) {
            state.loading = false;
            state.isAuth = false;
            state.error = error;
        },
        logoutMut(state) {
            state.isAuth = false;
            state.loading = false;
            state.error = null;
        },
    },
};
