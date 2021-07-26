export const auth = {
    namespaced: true,
    state: () => ({
        role: null,
        userInfo: null,
    }),
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
