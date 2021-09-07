<template>
    <main class="main-block">
        <div class="container-fluid">
            <VBreadcrumb
                :list="[
                    {
                        link: '/',
                        name: 'Главная'
                    },
                    {
                        name: 'Разделы'
                    },
                ]"
            />

            <div class="sSections section" id="sSections">
                <div class="row pb-2">
                    <div class="col">
                        <h1>Разделы</h1>
                    </div>
                    <div class="col-auto d-none d-sm-block">
                        <div @click="router.push('/section-creation')" class="btn-add">
                            <div class="btn-add__plus"></div>
                            <div class="btn-add__text">Добавить раздел</div>
                        </div>
                    </div>
                </div>

                <!-- Sections -->
                <div v-if="sections?.length !== 0">
                    <div v-for="(section, i) in sortedSections" :key="section.id" class="sSections__body">
                        <div class="sSections__item">
                            <div class="row">
                                <div class="col-auto">
                                    <div class="sSections__count">{{ i + 1 }}</div>
                                </div>
                                <div
                                    @click="() => $router.push(`/sections/${section?.id}`)"
                                    class="col fw-500 text-primary"
                                    style="cursor:pointer"
                                >{{ section?.title }}</div>
                                <div class="col-12 d-lg-none pb-3"></div>
                                <div class="sSections__col col-lg-auto col-md">
                                    <label class="custom-input form-check"
                                        ><input
                                            class="custom-input__input form-check-input"
                                            name="checkbox"
                                            type="checkbox"
                                            v-model="section.is_dictionary"
                                        /><span class="custom-input__text form-check-label"
                                            >Использовать как справочник</span
                                        >
                                    </label>
                                </div>
                                <div class="sSections__col col-lg-auto col-md">
                                    <label class="custom-input form-check"
                                        ><input
                                            class="custom-input__input form-check-input"
                                            name="checkbox"
                                            type="checkbox"
                                            v-model="section.is_navigation"
                                        /><span class="custom-input__text form-check-label"
                                            >Отображать в навигации</span
                                        >
                                    </label>
                                </div>
                                <div class="col-md-auto">
                                    <div class="sSections__btn-control">
                                        <div
                                            @click="() => $router.push(`/sections/${section?.id}`)"
                                            class="btn-edit-sm btn-secondary"
                                        >
                                            <svg class="icon icon-edit">
                                                <use xlink:href="/img/svg/sprite.svg#edit"></use>
                                            </svg>
                                        </div>
                                        <div
                                            v-if="user?.role === 'admin' || user?.role === 'moderator'"
                                            @click="setSectionToRemove(section)"
                                            class="btn-edit-sm btn-danger"
                                        >
                                            <svg class="icon icon-basket">
                                                <use xlink:href="/img/svg/sprite.svg#basket"></use>
                                            </svg>
                                        </div>
                                        <div
                                            @click="sortUpSectionItem(section, sortedSections)"
                                            class="btn-edit-sm btn-secondary"
                                        >
                                            <svg class="icon icon-chevron-up text-primary">
                                                <use xlink:href="/img/svg/sprite.svg#chevron-up"></use>
                                            </svg>
                                        </div>
                                        <div
                                            @click="sortDownSectionItem(section, sortedSections)"
                                            class="btn-edit-sm btn-secondary"
                                        >
                                            <svg class="icon icon-chevron-down text-primary">
                                                <use xlink:href="/img/svg/sprite.svg#chevron-down"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="sSections__footer">
                        <div class="d-sm-none mb-3 mt-1 w-100">
                            <div
                                @click="router.push('/section-creation')"
                                class="btn-add">
                                <div class="btn-add__plus"></div>
                                <div class="btn-add__text">Добавить раздел</div>
                            </div>
                        </div>
                        <button @click="updateSections" class="btn btn-primary">Сохранить</button>
                        <button @click="resetSections" class="btn btn-outline-primary ms-2">Отмена</button>
                    </div>
                </div>

                <!-- No Sections block -->
                <div v-if="sections?.length === 0 && !isSectionsLoading" class="sSections section" id="sSections">
                    <div class="sSections__center-empty">
                        <div class="sSections__title-empty h1">Пусто</div>
                        <p>
                            Для добавления раздела воспользуйтесь кнопкой в правом верхнем углу.
                        </p>
                    </div>
                </div>

                <!-- Sections loader -->
                <loader
                    v-if="isSectionsLoading"
                ></loader>
            </div>
        </div>

        <modal-window
            v-model="isRemoveAlertVisible"
            maxWidth="400px"
        >
            <div class="modal-window__header">
                <h3>Удаление</h3>
            </div>
            <p>
                Вы действительно хотите удалить раздел "{{ sectionToRemove?.title }}" <br />Данное действие
                необратимо!
            </p>
            <div class="modal-window__buttons">
                <v-button class="w-100" @click="removeSection(sectionToRemove?.id)">Удалить</v-button>
                <v-button :outline="true" class="w-100" @click="setRemoveAlertVisible(false)">Отменить</v-button>
            </div>
        </modal-window>

    </main>
</template>

<script>
import {ref, onMounted, computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import sectionsService from '@/services/sections.service';
import {sortByIndexUp, sortByIndexDown} from '@/utils/sortByIndex';
import {useStore} from 'vuex';
import VButton from '@/ui/VButton';
import VBreadcrumb from '@/ui/VBreadcrumb';
import ModalWindow from '@/components/ModalWindow';
import Loader from '@/components/Loader';

export default {
    components: {
        VButton,
        VBreadcrumb,
        ModalWindow,
        Loader,
    },
    setup() {
        const store = useStore();
        const user = computed(() => store.getters['user/getUser']);
        const router = useRouter();
        const initSections = ref([]);
        const sections = ref([]);
        const sortedSections = computed(() => {
            return [...sections.value].sort((a, b) => a.sort_index - b.sort_index);
        });
        watch(sections, (newVal) => {
            store.commit('sections/setSections', newVal);
        }, {deep: true});

        const isSectionsLoading = ref(true);

        const resetSections = () => {
            sections.value = JSON.parse(JSON.stringify(initSections.value));
        };

        const sortUpSectionItem = (item, arr) => {
            sections.value = sortByIndexUp(item, arr);
        };
        const sortDownSectionItem = (item, arr) => {
            sections.value = sortByIndexDown(item, arr);
        };

        //Update SectionsList_______________________________
        const updateSections = async () => {
            try {
                isSectionsLoading.value = true;
                const newSectionsArr = [...sortedSections.value].map((item, i) => ({...item, sort_index: i + 1}));
                initSections.value = JSON.parse(JSON.stringify(newSectionsArr));
                await sectionsService.updateSectionsList(newSectionsArr);
                initSections.value = newSectionsArr;
                isSectionsLoading.value = false;
            } catch (e) {
                isSectionsLoading.value = false;
                console.log(e);
            }
        };

        //Remove Section______________________________________
        const isRemoveAlertVisible = ref(false);
        const setRemoveAlertVisible = (bool) => {
            isRemoveAlertVisible.value = bool;
        };
        const sectionToRemove = ref(null);
        const setSectionToRemove = (item) => {
            sectionToRemove.value = item;
            setRemoveAlertVisible(true);
        };
        const removeSection = async (id) => {
            try {
                await sectionsService.removeSection(id);
                sections.value = [...sortedSections.value].filter((item) => item.id !== id);
                initSections.value = JSON.parse(JSON.stringify(sortedSections.value));
                setRemoveAlertVisible(false);
            } catch (e) {
                setRemoveAlertVisible(false);
                console.log(e.message);
            }
        };

        onMounted(async () => {
            try {
                isSectionsLoading.value = true;
                initSections.value = await sectionsService.getSections();
                sections.value = JSON.parse(JSON.stringify(initSections.value));
            } catch (e) {
                console.log(e);
            } finally {
                isSectionsLoading.value = false;
            }
        });

        return {
            sections,
            isSectionsLoading,
            resetSections,
            initSections,
            sortUpSectionItem,
            sortDownSectionItem,
            sortedSections,
            router,
            user,
            updateSections,
            isRemoveAlertVisible,
            setRemoveAlertVisible,
            sectionToRemove,
            setSectionToRemove,
            removeSection,
        };
    },
};
</script>

<style scoped>
</style>
