<template>

    <loader v-show="isLoading || isSelectsLoading"></loader>
    <main class="main-block">
        <div class="sSearchResult section" id="sSearchResult">
            <div class="container-fluid">
                <div class="row">
                    <div class="col col--main">
                        <VBreadcrumb
                            :list="[
                                {
                                    link: '/',
                                    name: 'Главная'
                                },
                                {
                                    name: `Поиск по разделу ${bcTitle}`
                                },
                            ]"
                        />
                        <div class="row">
                            <div class="col">
                                <div class="search-block">
                                    <form>
                                        <div class="search-block__input-wrap form-group">
                                            <input
                                                v-model="fullQueryObject.search"
                                                class="search-block__input form-control"
                                                name="text"
                                                type="text"
                                                placeholder="Поиск"/>
                                        </div>
                                        <!-- +e.input-wrap-->
                                        <button
                                            @click.prevent="updateMaterialsAndFiles( $router.currentRoute.value.params.id, queryObject)"
                                            @keyup.enter="updateMaterialsAndFiles( $router.currentRoute.value.params.id, queryObject)"
                                            class="search-block__btn">
                                            <svg class="icon icon-search ">
                                                <use xlink:href="/img/svg/sprite.svg#search"></use>
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div class="col-auto d-lg-none">
                                <div class="sSearchResult__btn-toggle sSearchResult__btn-toggle--js">
                                    <svg class="icon icon-sort ">
                                        <use xlink:href="/img/svg/sprite.svg#sort"></use>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="d-lg-none">
                            <div class="filter-info">
                                <div class="filter-info__left">Фильтры<span class="text-danger ms-2">4</span>
                                </div>
                                <div class="filter-info__clear btn-info">
                                    <svg class="icon icon-close ">
                                        <use xlink:href="/img/svg/sprite.svg#close"></use>
                                    </svg>очистить
                                </div>
                            </div>
                        </div>
                        <div class="d-lg-block d-none">
                            <div class="">
 <!-- Селекторы -->
                                <section-search-selectors
                                    :allSections="allSections"
                                    :fieldsArray="filteredSectionFields"
                                    @updateSelectors="updateSelectorHandler"
                                    @isSelectsLoading = "setSelectsLoading"
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
                        </div>

 <!-- Результаты поиска -->
                        <search-results
                            :allSections="allSections"
                            :materialsArr="materials"
                            :filesArr="files"
                        ></search-results>
                        <div
                            v-if="totalPages > 1 && currentPage !== totalPages"
                            v-intersection="addSearch"
                            class="observer"
                        ></div>
                        <div
                            v-show="isPreloaderShown"
                            class="search-results-preloader"
                        >
                            <span class="spinner-border"></span>
                        </div>
                    </div>
                    <div class="col-aside col-lg-auto d-flex flex-column">
                        <div class="sSearchResult__aside">
                            <div class="sSearchResult__aside-head">
                                <div class="row">
                                    <div class="col">
                                        <div class="sSearchResult__btn-text">
                                            <svg class="icon icon-close ">
                                                <use xlink:href="/img/svg/sprite.svg#close"></use>
                                            </svg>
                                            <span
                                                @click="resetFilters"
                                                class="ms-2">очистить фильтр
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-auto d-lg-none">
                                        <div class="sSearchResult__btn-text sSearchResult__btn-text--close-js"> <span class="me-2">Скрыть</span>
                                            <svg class="icon icon-chevron-right ">
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
                                        v-if="fullQueryObject.sort.field === 'created_at' && fullQueryObject.sort.direction === 'asc'"
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
                                        v-else-if="fullQueryObject.sort.field === 'created_at' && fullQueryObject.sort.direction === 'desc'"
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
                                        v-else-if="fullQueryObject.sort.field === 'name'"
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
                                        v-if="fullQueryObject.sort.field === 'name' && fullQueryObject.sort.direction === 'asc'"
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
                                        v-else-if="fullQueryObject.sort.field === 'name' && fullQueryObject.sort.direction === 'desc'"
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
                                        v-if="fullQueryObject.sort.field === 'created_at'"
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
    </main>
</template>

<script>
import {onMounted, ref, computed, watch, reactive} from 'vue';
import Loader from '@/components/Loader';
import VBreadcrumb from '@/ui/VBreadcrumb';
import sectionsService from '@/services/sections.service';
import searchService from '@/services/search.service';
import {useRouter} from 'vue-router';
import SectionSearchSelectors from '@/pages/SectionSearchPage/SectionSearchSelectors';
import FilesTypes from '@/pages/SectionSearchPage/FilesTypes';
import CheckboxFilters from '@/pages/SectionSearchPage/CheckboxFilters';
import SearchResults from '@/pages/SectionSearchPage/SearchResults';
import DateFilters from "@/pages/SectionSearchPage/DateFilters";

export default {
    components: {
      Loader,
      VBreadcrumb,
      FilesTypes,
      SectionSearchSelectors,
      CheckboxFilters,
      SearchResults,
      DateFilters,
    },
    setup() {

        const router = useRouter();
        const isLoading = ref(true);
        const isSelectsLoading = ref(false);
        const section = ref({});
        const allSections = ref([]);
        const bcTitle = ref('');

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

// Выдача поиска_______________________
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

        const fullQueryObject = reactive(initQueryObject);

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
                    ...fullQueryObject.checkboxes,
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
        const setSelectsLoading = (bool) => {
            isSelectsLoading.value = bool;
        }
//Сбросы поиска________________________
        const resetFilters = () => {
            fullQueryObject.checkboxes = [];
            fullQueryObject.extensions = [];
            fullQueryObject.dateFilters = {};
        };

        const resetSelectorsNSearch = () => {
            section.value.fields = [...section.value.fields]
            fullQueryObject.selectors = [];
            fullQueryObject.search = '';
        };
        const resetSelectors = () => {
            section.value.felds = [...section.value.fields];
            fullQueryObject.selectors = [];
        };

        const showResetSelectors = computed(() => {
            return !!(Object.keys(fullQueryObject.selectors).length || fullQueryObject.search.length);
        });

// Отправка поискового запроса_____________
        const updateMaterialsAndFiles = async (url, queryObject) => {
            try {
                isLoading.value = true;
                const materialsAndFiles = await searchService.searchSectionPost(url, queryObject);
                materials.value = materialsAndFiles.data.materials;
                files.value = materialsAndFiles.data.files;
                currentPage.value = materialsAndFiles.current_page;
                totalPages.value = materialsAndFiles.last_page;
            } catch(e) {
                console.log(e);
            } finally {
                isLoading.value = false;
            }
        }

        const updateSearchPage = async (id) => {
            try {
                isLoading.value = true;
                section.value = await sectionsService.getSectionObject(id);
                resetFilters();
                resetSelectorsNSearch();
                bcTitle.value = section.value.title;

            } catch(e) {
                console.log(e)
            } finally {
                isLoading.value = false;
            }
        };

        watch( queryObject, (newVal, oldVal) => {
            if (newVal.search === oldVal.search) {
                    updateMaterialsAndFiles(router.currentRoute.value.params.id, newVal)
                }
            },
            {deep: true}
        );

        watch( router.currentRoute, async (newVal) => {
            if (newVal.params.id) {
                await updateSearchPage(router.currentRoute.value.params.id);
            }
        });
        onMounted(async () => {
            try {
                isLoading.value = true;
                allSections.value = await sectionsService.getSections();
                await updateSearchPage(router.currentRoute.value.params.id);
            } catch(e) {
                console.log(e)
            }
        });

// Подгрузка при скролле__________________________________________________
        const addSearch = async () => {
            isPreloaderShown.value = true;
            if (currentPage.value < totalPages.value) {
                try {
                    const materialsAndFiles = await searchService
                        .searchSectionPost(`${router.currentRoute.value.params.id}/?page=${currentPage.value + 1}`, queryObject.value);
                    materials.value = [...materials.value, ...materialsAndFiles.data.materials];
                    files.value = [...files.value, ...materialsAndFiles.data.files];
                    currentPage.value = materialsAndFiles.current_page;
                    totalPages.value = materialsAndFiles.last_page;
                } catch(e) {
                    console.log(e);
                } finally {
                    isPreloaderShown.value = false;
                }
            }
        };

        return {
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
            resetSelectors,
            resetSelectorsNSearch,
            showResetSelectors,
            addSearch,
            totalPages,
            currentPage,
            isPreloaderShown,
            filteredSectionFields,
            fullQueryObject,
            queryObject,
            setSelectsLoading,
            isSelectsLoading,
        }
    },
}
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