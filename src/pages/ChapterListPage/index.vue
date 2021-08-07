<template>
    <main class="main-block">
        <div class="container-fluid">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/" itemprop="item"
                            ><span itemprop="name">Главная</span> <meta itemprop="position" content="1"
                        /></a>
                    </li>
                    <li class="breadcrumb-item active">
                        <a href="#" itemprop="item"
                            ><span itemprop="name">Разделы</span> <meta itemprop="position" content="2"
                        /></a>
                    </li>
                </ol>
            </nav>

            <div class="sSections section" id="sSections">
                <div class="row pb-2">
                    <div class="col">
                        <h1>Разделы</h1>
                    </div>
                    <div class="col-auto d-none d-sm-block">
                        <div @click="router.push('/material-creation')" class="btn-add">
                            <div class="btn-add__plus"></div>
                            <div class="btn-add__text">Добавить раздел</div>
                        </div>
                    </div>
                </div>

                <!-- Sections -->
                <div v-if="sections?.length !== 0">
                    <div v-for="section in sortedSections" :key="section.id" class="sSections__body">
                        <div class="sSections__item">
                            <div class="row">
                                <div class="col-auto">
                                    <div class="sSections__count">1</div>
                                </div>
                                <div class="col fw-500 text-primary">{{ section?.title }}</div>
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
                                            @click="router.push('/enums/' + section?.id)"
                                            class="btn-edit-sm btn-secondary"
                                        >
                                            <svg class="icon icon-edit">
                                                <use xlink:href="img/svg/sprite.svg#edit"></use>
                                            </svg>
                                        </div>
                                        <div
                                            v-if="user?.role === 'admin' || user?.role === 'moderator'"
                                            @click="setSectionToRemove(section)"
                                            class="btn-edit-sm btn-danger"
                                        >
                                            <svg class="icon icon-basket">
                                                <use xlink:href="img/svg/sprite.svg#basket"></use>
                                            </svg>
                                        </div>
                                        <div
                                            @click="sortUpSectionItem(section, sortedSections)"
                                            class="btn-edit-sm btn-secondary"
                                        >
                                            <svg class="icon icon-chevron-up text-primary">
                                                <use xlink:href="img/svg/sprite.svg#chevron-up"></use>
                                            </svg>
                                        </div>
                                        <div
                                            @click="sortDownSectionItem(section, sortedSections)"
                                            class="btn-edit-sm btn-secondary"
                                        >
                                            <svg class="icon icon-chevron-down text-primary">
                                                <use xlink:href="img/svg/sprite.svg#chevron-down"></use>
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
                            <div class="btn-add">
                                <div class="btn-add__plus"></div>
                                <div class="btn-add__text">Добавить раздел</div>
                            </div>
                        </div>
                        <button @click="updateSections" class="btn btn-primary">Сохранить</button>
                        <button @click="resetSections" class="btn btn-outline-primary ms-2">Отмена</button>
                    </div>
                </div>

                <!-- No Sections block -->
                <div v-else class="sSections section" id="sSections">
                    <div class="sSections__center-empty">
                        <div class="sSections__title-empty h1">Добавьте новый раздел</div>
                        <p>
                            Вы&nbsp;еще не&nbsp;добавили ниодного раздела, чтобы добавить нажмите на&nbsp;кнопку
                            &laquo;добавить раздел&raquo; в&nbsp;правом <br />
                            верхнем углу!
                        </p>
                    </div>
                </div>

                <!-- Sections loader -->
                <div v-if="isSectionsLoading" class="sections-loader__wrapper">
                    <div class="sections-loader__cont">Loading...</div>
                </div>
            </div>
        </div>

        <div class="mock-modal__wrapper" v-show="isRemoveAlertVisible">
            <div class="mock-modal__cont">
                <b class="mock-modal__closer" @click="setRemoveAlertVisible(false)">x</b>
                <div class="mock-modal__header">
                    <h3>Удаление</h3>
                </div>
                <p>
                    Вы действительно хотите удалить раздел "{{ sectionToRemove?.title }}" <br />Данное действие
                    необратимо!
                </p>
                <div class="mock-modal__buttons">
                    <v-button :outline="true" class="w-100" @click="setRemoveAlertVisible(false)">Отменить</v-button>
                    <v-button class="w-100" @click="removeSection(sectionToRemove?.id)">Удалить</v-button>
                </div>
            </div>
        </div>
    </main>

    <!-- Section links in header -->
    <teleport to="#header-sections">
        <ul class="menu" id="header-sections">
            <li v-for="section in sectionsToHeader" :key="section?.id">
                <router-link :to="'/enums/' + section?.id">{{ section?.title }}</router-link>
            </li>
        </ul>
    </teleport>
</template>

<script>
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
// import sectionsService from '@/services/sections.service';
import {sortByIndexUp, sortByIndexDown} from '@/utils/sortByIndex';
import {useStore} from 'vuex';
import VButton from '@/ui/VButton';

export default {
    components: {
        VButton,
    },
    setup() {
        const store = useStore();
        const user = computed(() => store.getters['user/getUser']);
        const router = useRouter();
        let initSections;
        const sections = ref([]);
        const sortedSections = computed(() => {
            return [...sections.value].sort((a, b) => a.sort_index - b.sort_index);
        });
        const sectionsToHeader = computed(() =>
            [...sortedSections.value].filter((item) => item.is_navigation === true)
        );

        const isSectionsLoading = ref(true);
        const mockData = [
            {
                id: 'f2a6b279-f6cd-4c78-87aa-b998b707e3a7',
                title: 'Агенты',
                image: 'absolute://path.to/image.jpg',
                is_dictionary: true,
                is_navigation: true,
                sort_index: 1,
            },
            {
                id: '09c45d85-4e31-4c99-ac20-1e75dfa5f106',
                title: 'Поставщики',
                image: 'absolute://path.to/image.jpg',
                is_dictionary: true,
                is_navigation: true,
                sort_index: 3,
            },
            {
                id: 'b6363315-f190-40ba-a183-a78baabda52c',
                title: 'Автомобили',
                image: 'absolute://path.to/image.jpg',
                is_dictionary: true,
                is_navigation: true,
                sort_index: 2,
            },
        ];

        const resetSections = () => {
            sections.value = JSON.parse(JSON.stringify(initSections));
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
                // await sectionsService.updateSectionsList(sortedSections.value);
                initSections = JSON.parse(JSON.stringify(sortedSections.value));
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
                // await sectionsService.removeSection(id);
                sections.value = [...sortedSections.value].filter((item) => item.id !== id);
                initSections = JSON.parse(JSON.stringify(sortedSections.value));
                setRemoveAlertVisible(false);
            } catch (e) {
                setRemoveAlertVisible(false);
                console.log(e.message);
            }
        };

        onMounted(async () => {
            try {
                // initSections.value = await sectionsService.getSections();
                initSections = JSON.parse(JSON.stringify(mockData));
                sections.value = JSON.parse(JSON.stringify(mockData));
                isSectionsLoading.value = false;
            } catch (e) {
                isSectionsLoading.value = false;
                console.log(e);
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
            sectionsToHeader,
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
.sections-loader__wrapper {
    position: fixed;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5);
}
.sections-loader__cont {
    font-size: 26px;
    color: #1d47ce;
}

/* Modal Alert window */
.mock-modal__wrapper {
    display: flex;
    z-index: 10;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
}
.mock-modal__cont {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 400px;
    background-color: #fff;
    padding: 32px;
    border-radius: 5px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
}
.mock-modal__header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
}
.mock-modal__closer {
    display: block;
    position: absolute;
    font-size: 26px;
    line-height: 26px;
    top: 15px;
    right: 20px;
    cursor: pointer;
}
.mock-modal__buttons {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
.mock-modal__buttons button:first-child {
    margin-right: 5px;
}
</style>
