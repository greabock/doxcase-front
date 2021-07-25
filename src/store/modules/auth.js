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
        setUserData({commit}, userInfo) {
            commit('loginSuccess', userInfo);
        },
        logout({commit}) {
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
