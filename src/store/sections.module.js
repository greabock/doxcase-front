import sectionService from '@/services/sections.service';

export const sectionsModule = {
    state: () => ({
        sections: [],
    }),
    getters: {
        getSections(state) {
            return state.sections;
        },
    },
    mutations: {
        setSections(state, sections) {
            state.sections = sections;
        },
    },
    actions: {
        async fetchSections({commit}) {
            try {
                const sections = await sectionService.getSections();
                commit('setSections', sections);
            } catch (e) {
                console.log(e);
            }
        },
    },
    namespaced: true,
};
