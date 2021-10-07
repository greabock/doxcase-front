<template>
    <loader v-show="isLoading"></loader>
    <main v-if="!isAtFirst" class="main-block">
        <div class="sSearchResult section" id="sSearchResult">
            <div class="container-fluid">
                <div class="row">
                    <div class="col col--main">
                        <VBreadcrumb
                            :list="[
                                {
                                    name: 'Главная'
                                },
                            ]"
                        />
                        <div class="row">
                            <div class="col">
                                <div class="search-block">
                                    <form>
                                        <div class="search-block__input-wrap form-group">
                                            <input
                                                v-model="searchLine"
                                                class="search-block__input form-control"
                                                name="text"
                                                type="text"
                                                placeholder="Поиск"
                                            />
                                        </div>
                                        <!-- +e.input-wrap-->
                                        <button
                                            @click.prevent="handleSearch"
                                            @keyup.enter="updateMaterialsAndFiles(currentSectionId, queryObject)"
                                            class="search-block__btn"
                                        >
                                            <svg class="icon icon-search">
                                                <use xlink:href="/img/svg/sprite.svg#search"></use>
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div class="col-auto d-lg-none">
                                <div
                                    @click="isMobileSort = true"
                                    class="sSearchResult__btn-toggle sSearchResult__btn-toggle--js"
                                >
                                    <svg class="icon icon-sort">
                                        <use xlink:href="/img/svg/sprite.svg#sort"></use>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div
                            v-show="Object.keys(section).length > 0"
                            class="d-lg-none"
                        >
                            <div class="filter-info">
                                <div
                                    @click="isModSelectorsVisible = true"
                                    class="filter-info__left"
                                >Фильтры<span class="text-danger ms-2">{{Object.keys(fullQueryObject.selectors).length || ''}}</span>
                                </div>
                                <div
                                    @click="resetSelectors"
                                    class="filter-info__clear btn-info"
                                >
                                    <svg class="icon icon-close">
                                        <use xlink:href="/img/svg/sprite.svg#close"></use>
                                    </svg>очистить
                                </div>
                            </div>
                        </div>
<!-- Переключатели разделов -->
                        <div v-if="allSections?.length" class="sSearchResult__btns py-3">
                            <section-search-radio
                                :key="13234"
                                v-model="currentSectionId">
                            </section-search-radio>
                            <section-search-radio
                                v-for="section in allSections"
                                :key="section?.id"
                                :section="section"
                                v-model="currentSectionId"
                            >
                            </section-search-radio>
                        </div>
<!-- Селекторы -->
                        <div class="d-lg-block d-none">
                            <div class="">
                                <section-search-selectors
                                    :selectorOptionsArr="selectorOptionsArr"
                                    :filteredFields="filteredFields"
                                    @updateSelectors="updateSelectorHandler"
                                ></section-search-selectors>
                            </div>
                            <div class="mb-3">
                                <div v-if="showResetSelectors" class="sSearchResult__btn-text">
                                    <svg class="icon icon-close">
                                        <use xlink:href="/img/svg/sprite.svg#close"></use>
                                    </svg>
                                    <span @click="resetSelectorsNSearch" class="ms-2">очистить фильтр</span>
                                </div>
                            </div>
                        </div>
<!-- Моб. селекторы -->
                        <mob-modal-window
                            v-model="isModSelectorsVisible"
                            maxWidth="600px"
                        >
                            <div class="modal-window__header mb-0">
                                <h3>Фильтры</h3>
                            </div>
                            <div>
                                <section-search-selectors
                                    :selectorOptionsArr="selectorOptionsArr"
                                    :filteredFields="filteredFields"
                                    @updateSelectors="updateSelectorHandler"
                                ></section-search-selectors>
                            </div>
                            <div class="mb-3">
                                <div
                                    v-if="showResetSelectors"
                                    class="sSearchResult__btn-text">
                                    <svg class="icon icon-close ">
                                        <use xlink:href="/img/svg/sprite.svg#close"></use>
                                    </svg>
                                    <span
                                        @click='resetSelectorsNSearch'
                                        class="ms-2">очистить фильтр</span>
                                </div>
                            </div>
                        </mob-modal-window>

<!-- Результаты поиска -->
                        <search-results
                            :allSections="allSections"
                            :materialsArr="materials"
                            :filesArr="files"
                            :isSearchResultsLoading="isSearchResultsLoading"
                        >
                        </search-results>
                        <div
                            v-if="totalPages > 1 && currentPage !== totalPages"
                            v-intersection="addSearch"
                            class="observer"
                        ></div>
                        <div v-show="isPreloaderShown" class="search-results-preloader">
                            <span class="spinner-border"></span>
                        </div>
                    </div>
                    <div
                        id="sort-aside-node"
                        class="col-aside col-lg-auto d-flex flex-column"
                    >
                        <div
                            class="sSearchResult__aside"
                            :class="{'active': isMobileSort}"
                        >
                            <div class="sSearchResult__aside-head">
                                <div class="row">
                                    <div class="col">
                                        <div class="sSearchResult__btn-text">
                                            <svg class="icon icon-close">
                                                <use xlink:href="/img/svg/sprite.svg#close"></use>
                                            </svg>
                                            <span
                                                @click="resetFilters"
                                                class="ms-2"
                                            >очистить фильтр
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-auto d-lg-none">
                                        <div
                                            @click="isMobileSort = false"
                                            class="sSearchResult__btn-text sSearchResult__btn-text--close-js"
                                        >
                                            <span class="me-2">Скрыть</span>
                                            <svg class="icon icon-chevron-right">
                                                <use xlink:href="/img/svg/sprite.svg#chevron-right"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div class="sSearchResult__aside-body">
<!-- Сортировка -->
                                <div class="sSearchResult__aside-group">
                                    <div class="fw-500 pb-3">Сортировать</div>

<!-- Сортировка по дате -->
                                    <div
                                        v-show="fullQueryObject.sort.field === 'created_at' && fullQueryObject.sort.direction === 'asc'"
                                        @click="toggleSort('created_at','desc')"
                                        class="sSearchResult__filter-item">
                                        <div class="sSearchResult__filter-btns">
                                            <div class="sSearchResult__filter-btn active">
                                                <svg class="icon icon-arrow-up ">
                                                    <use xlink:href="/img/svg/sprite.svg#arrow-up"></use>
                                                </svg>
                                            </div>
                                            <div class="sSearchResult__filter-btn">
                                                <svg class="icon icon-arrow-down ">
                                                    <use xlink:href="/img/svg/sprite.svg#arrow-down"></use>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="sSearchResult__filter-result-text">сначала новые
                                        </div>
                                    </div>
                                    <div
                                        v-show="fullQueryObject.sort.field === 'created_at' && fullQueryObject.sort.direction === 'desc'"
                                        @click="toggleSort('created_at','asc')"
                                        class="sSearchResult__filter-item">
                                        <div class="sSearchResult__filter-btns">
                                            <div class="sSearchResult__filter-btn active">
                                                <svg class="icon icon-arrow-down ">
                                                    <use xlink:href="/img/svg/sprite.svg#arrow-down"></use>
                                                </svg>
                                            </div>
                                            <div class="sSearchResult__filter-btn">
                                                <svg class="icon icon-arrow-up ">
                                                    <use xlink:href="/img/svg/sprite.svg#arrow-up"></use>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="sSearchResult__filter-result-text">сначала старые
                                        </div>
                                    </div>
                                    <div
                                        v-show="fullQueryObject.sort.field === 'name'"
                                        @click="toggleSort('created_at','asc')"
                                        class="sSearchResult__filter-item">
                                        <div class="sSearchResult__filter-btns">
                                            <div class="sSearchResult__filter-btn">
                                                <svg class="icon icon-arrow-up ">
                                                    <use xlink:href="/img/svg/sprite.svg#arrow-up"></use>
                                                </svg>
                                            </div>
                                            <div class="sSearchResult__filter-btn">
                                                <svg class="icon icon-arrow-down ">
                                                    <use xlink:href="/img/svg/sprite.svg#arrow-down"></use>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="sSearchResult__filter-result-text">сначала новые
                                        </div>
                                    </div>
<!-- Сортировка по алфавиту -->
                                    <div
                                        v-show="fullQueryObject.sort.field === 'name' && fullQueryObject.sort.direction === 'asc'"
                                        @click="toggleSort('name','desc')"
                                        class="sSearchResult__filter-item">
                                        <div class="sSearchResult__filter-btns">
                                            <div class="sSearchResult__filter-btn active">
                                                <svg class="icon icon-a ">
                                                    <use xlink:href="/img/svg/sprite.svg#a"></use>
                                                </svg>
                                            </div>
                                            <div class="sSearchResult__filter-btn">
                                                <svg class="icon icon-Ya ">
                                                    <use xlink:href="/img/svg/sprite.svg#Ya"></use>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="sSearchResult__filter-result-text">от А до Я
                                        </div>
                                    </div>
                                    <div
                                        v-show="fullQueryObject.sort.field === 'name' && fullQueryObject.sort.direction === 'desc'"
                                        @click="toggleSort('name','asc')"
                                        class="sSearchResult__filter-item">
                                        <div class="sSearchResult__filter-btns">
                                            <div class="sSearchResult__filter-btn">
                                                <svg class="icon icon-a ">
                                                    <use xlink:href="/img/svg/sprite.svg#a"></use>
                                                </svg>
                                            </div>
                                            <div class="sSearchResult__filter-btn active">
                                                <svg class="icon icon-Ya ">
                                                    <use xlink:href="/img/svg/sprite.svg#Ya"></use>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="sSearchResult__filter-result-text">от Я до А
                                        </div>
                                    </div>
                                    <div
                                        v-show="fullQueryObject.sort.field === 'created_at'"
                                        @click="toggleSort('name','asc')"
                                        class="sSearchResult__filter-item">
                                        <div class="sSearchResult__filter-btns">
                                            <div class="sSearchResult__filter-btn">
                                                <svg class="icon icon-Ya ">
                                                    <use xlink:href="/img/svg/sprite.svg#Ya"></use>
                                                </svg>
                                            </div>
                                            <div class="sSearchResult__filter-btn">
                                                <svg class="icon icon-a ">
                                                    <use xlink:href="/img/svg/sprite.svg#a"></use>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="sSearchResult__filter-result-text">от А до Я
                                        </div>
                                    </div>
                                </div>
<!-- Типы документов -->
                                <files-types
                                    v-model='fullQueryObject.extensions'
                                >
                                </files-types>

<!-- Чекбоксы -->
                                <checkbox-filters
                                    :fieldsArray="filteredSectionFields"
                                    v-model="fullQueryObject.checkboxes"
                                >
                                </checkbox-filters>
<!-- Даты -->
                                <date-filters
                                    :fieldsArray="filteredSectionFields"
                                    v-model="fullQueryObject.dateFilters"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end sSearchResult-->
    </main>

    <main v-else class="main-block d-flex align-items-center">
        <div class="search-block search-block--mx">
            <form>
                <div class="search-block__input-wrap form-group">
                    <input
                        v-model="searchLine"
                        class="search-block__input form-control"
                        name="text"
                        type="text"
                        placeholder="Поиск"
                    />
                </div>
                <!-- +e.input-wrap-->
                <button
                    @click.prevent="handleSearch"
                    @keyup.enter="updateMaterialsAndFiles(currentSectionId, queryObject)"
                    class="search-block__btn"
                    type="submit"
                >
                    <svg class="icon icon-search">
                        <use xlink:href="/img/svg/sprite.svg#search"></use>
                    </svg>
                </button>
            </form>
        </div>
    </main>
</template>
<script>
import {onMounted, ref, computed, watch, reactive, onUnmounted} from 'vue';
import Loader from '@/components/Loader';
import MobModalWindow from '@/components/MobModalWindow';
import VBreadcrumb from '@/ui/VBreadcrumb';
import sectionsService from '@/services/sections.service';
import searchService from '@/services/search.service';
import SectionSearchSelectors from '@/pages/SectionSearchPage/SectionSearchSelectors';
import FilesTypes from '@/pages/SectionSearchPage/FilesTypes';
import CheckboxFilters from '@/pages/SectionSearchPage/CheckboxFilters';
import SearchResults from '@/pages/SectionSearchPage/SearchResults';
import SectionSearchRadio from '@/components/SearchSectionRadio';
import {useStore} from 'vuex';
import DateFilters from "@/pages/SectionSearchPage/DateFilters";
import {useFilteredFields} from '@/hooks/SearchHooks/useFilteredFields';
import {useSelectorOptions} from '@/hooks/SearchHooks/useSelectorOptions';

export default {
    components: {
        Loader,
        VBreadcrumb,
        FilesTypes,
        SectionSearchSelectors,
        CheckboxFilters,
        SearchResults,
        SectionSearchRadio,
        DateFilters,
        MobModalWindow,
    },
    setup() {
        const isAtFirst = ref(true); // При первом открытии старницы

        const isLoading = ref(false);
        const isSearchResultsLoading = ref(false);

        const bcTitle = ref('');
        const currentSectionId = ref('');
        const section = ref({}); // если идет поиск по секции или {}
        const allSections = ref([]);

        const currentPage = ref(1);
        const totalPages = ref(1);
        const isPreloaderShown = ref(false);

        const filteredSectionFields = computed(() => {
            if (section.value.fields) {
                return section.value.fields.filter((field) => !!field.filter_sort_index);
            } else {
                return []
            }
        })
        const store = useStore();

        const {filteredFields} = useFilteredFields(filteredSectionFields);
        const {
            selectorOptionsArr,
            updateSelectorOptionsArr,
            resetSelectorOptions
        } = useSelectorOptions(filteredFields);

//Моб. отображение___________________________
        const isMobileSort = ref(false);
        const hideMobileSort = (e) => {
            const sortContainer = document.querySelector('#sort-aside-node');
            const openMobileSortButton = document.querySelector('.sSearchResult__btn-toggle--js');
            if(!sortContainer.contains(e.target) && !openMobileSortButton.contains(e.target)) {
                isMobileSort.value = false;
            }
        }
        const isModSelectorsVisible = ref(false);

// Выдача поиска_______________
        const materials = ref([]);
        const files = ref([]);

// Объект запроса_______________________
        const initQueryObject = {
            search: '',
            sort: {
                field: 'created_at',
                direction: 'asc',
            },
            extensions: [],
            checkboxes:[],
            dateFilters:{},
            selectors: []
        }

        const searchLine = ref('');

        const fullQueryObject = reactive(initQueryObject);

        const convertCheckboxes = (arr) => {
            const checkboxObj = {};
            arr.forEach((item) => checkboxObj[item] = 1);
            return checkboxObj
        }

        const queryObject = computed(() => {
            const iterCheckboxes = fullQueryObject.checkboxes.map((item, i, arr) => ({[arr[i]] : 1 })).values();
            let checkboxes = {};
            for (let val of iterCheckboxes) {
                checkboxes = {...checkboxes, ...val};
            }

            return {
                search: fullQueryObject.search,
                sort: fullQueryObject.sort,
                materials: fullQueryObject.extensions.includes('materials'),
                extensions: fullQueryObject.extensions.filter(item => item !== 'materials'),
                filter: {
                    ...convertCheckboxes(fullQueryObject.checkboxes),
                    ...fullQueryObject.selectors,
                    ...fullQueryObject.dateFilters,
                }
            }
        });

//Обработчики событий_______________________________________
        const toggleSort = (field, direction) => {
            fullQueryObject.sort = { field, direction }
        };
        const updateSelectorHandler = (newSelectors) => {
            fullQueryObject.selectors = newSelectors;
        }

//Сбросы поиска________________________
        const resetFilters = () => {
            fullQueryObject.checkboxes = [];
            fullQueryObject.extensions = [];
            fullQueryObject.dateFilters = {};
        };

        const resetSelectorsNSearch = () => {
            fullQueryObject.selectors = [];
            fullQueryObject.search = '';
            resetSelectorOptions();
            searchLine.value = '';
            if (section.value.fields) {
                section.value.fields = [...section.value.fields]
            } else {
                updateMaterialsAndFiles('', queryObject);
            }
        };
        const resetSelectors = () => {
            if (Object.keys(fullQueryObject.selectors).length && section.value.fields) {
                section.value.fields = [...section.value.fields];
                fullQueryObject.selectors = [];
                resetSelectorOptions();
            }
        };

        const showResetSelectors = computed(() => {
            return !!(Object.keys(fullQueryObject.selectors).length || fullQueryObject.search.length);
        });


// Отправка поискового запроса_____________
        const updateMaterialsAndFiles = async (id, queryObject) => {
            try {
                isSearchResultsLoading.value = true;
                const materialsAndFiles = await searchService.searchSectionPost(id, queryObject);
                materials.value = materialsAndFiles.data.materials;
                files.value = materialsAndFiles.data.files;
                currentPage.value = materialsAndFiles.current_page;
                totalPages.value = materialsAndFiles.last_page;
            } catch (e) {
                console.log(e);
            } finally {
                isSearchResultsLoading.value = false;
            }
        };

        const updateSearchPage = async (id) => {
            try {
                isLoading.value = true;
                section.value = await sectionsService.getSectionObject(id);
                await updateSelectorOptionsArr();
                resetSelectors();
                resetFilters();
            } catch (e) {
                console.log(e);
            } finally {
                isLoading.value = false;
            }
        };

        watch(() => store.getters['search/getAtFirst'],
            () => {
                fullQueryObject.search = '';
                currentSectionId.value = '';
                searchLine.value = '';
                isAtFirst.value = true;
            }
        );
        watch( queryObject, async (newVal) => {
               await updateMaterialsAndFiles(currentSectionId.value, newVal);
            },
            {deep: true}
        );

        watch(currentSectionId, async () => {
            await updateSearchPage(currentSectionId.value);
        });

        onMounted(async () => {
            try {
                allSections.value = await sectionsService.getSections();
                window.addEventListener('click', (e) => hideMobileSort(e));
            } catch (e) {
                console.log(e);
            }
        });
        onUnmounted(() => {
            window.removeEventListener('click', hideMobileSort);
        });


        const handleSearch = async () => {
            fullQueryObject.search = searchLine.value;
            isAtFirst.value = false;
        };

// Подгрузка при скролле_________________________________________
        const addSearch = async () => {
            isPreloaderShown.value = true;
            if (currentPage.value < totalPages.value) {
                try {
                    const materialsAndFiles = await searchService.searchSectionPost(
                        `${currentSectionId.value}/?page=${currentPage.value + 1}`,
                        queryObject
                    );
                    materials.value = [...materials.value, ...materialsAndFiles.data.materials];
                    files.value = [...files.value, ...materialsAndFiles.data.files];
                    currentPage.value = materialsAndFiles.current_page;
                    totalPages.value = materialsAndFiles.last_page;
                } catch (e) {
                    console.log(e);
                } finally {
                    isPreloaderShown.value = false;
                }
            }
        };

        return {
            addSearch,
            isAtFirst,
            isLoading,
            bcTitle,
            toggleSort,
            updateSelectorHandler,
            section,
            allSections,
            searchService,
            materials,
            files,
            updateMaterialsAndFiles,
            resetFilters,
            queryObject,
            resetSelectors,
            resetSelectorsNSearch,
            showResetSelectors,
            currentSectionId,
            handleSearch,
            filteredSectionFields,
            fullQueryObject,
            totalPages,
            currentPage,
            isPreloaderShown,
            isMobileSort,
            isModSelectorsVisible,
            selectorOptionsArr,
            updateSelectorOptionsArr,
            isSearchResultsLoading,
            filteredFields,
            searchLine
        };
    },
};
</script>

<style scoped>
.sSearchResult__filter-btn {
    color: #bbb;
}
.sSearchResult__filter-btn.active {
    color: #1d47ce;
}
.sSearchResult__aside-head {
    margin-bottom: 0.6rem;
}
.search-results-preloader {
    display: flex;
    justify-content: center;
    padding: 0 0 10px;
    color: #1d47d5;
}
</style>
