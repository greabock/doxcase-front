import AuthService from '../../services/auth.service';

const initialState = {
    role: null,
    userInfo: {
        id: undefined,
        name: undefined,
        avatar: null,
        role: null,
        login: null,
        email: null,
    },
};

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        async login({commit}, token) {
            const userInfo = await AuthService.login(token);
            commit('loginSuccess', userInfo);
        },
        logout({commit}) {
            AuthService.logout();
            commit('logout');
        },
    },
    mutations: {
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
