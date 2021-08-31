export const searchModule = {
    state: () => ({
        atFirst: 1,
    }),
    getters: {
        getAtFirst(state) {
            return state.atFirst;
        },
    },
    mutations: {
        updateAtFirst(state, num) {
            state.atFirst += num;
        },
    },
    actions: {
        increaseAtFirst({commit}) {
            commit('updateAtFirst', 1);
        },
    },
    namespaced: true,
};
