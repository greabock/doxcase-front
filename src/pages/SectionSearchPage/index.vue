<template>

    <loader v-show="isLoading"></loader>
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
                                                v-model="searchObj"
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
                                        @click='resetSelectors'
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
<!-- Сортировка -->
                            <div class="sSearchResult__aside-body">

                                <div class="sSearchResult__aside-group">
                                    <div class="fw-500 pb-3">Сортировать</div>
<!-- Сортировка по дате -->
                                    <div
                                        v-if="sortObj.field === 'created_at' && sortObj.direction === 'asc'"
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
                                        v-else-if="sortObj.field === 'created_at' && sortObj.direction === 'desc'"
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
                                        v-else-if="sortObj.field === 'name'"
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
                                        v-if="sortObj.field === 'name' && sortObj.direction === 'asc'"
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
                                        v-else-if="sortObj.field === 'name' && sortObj.direction === 'desc'"
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
                                        v-if="sortObj.field === 'created_at'"
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
                                    v-model='extensionsObj'
                                >
                                </files-types>

<!-- Чекбоксы -->
                                <checkbox-filters
                                    :fieldsArray="filteredSectionFields"
                                    v-model="checkboxesObj"
                                >
                                </checkbox-filters>
                               <date-filters
                                   :fieldsArray="filteredSectionFields"
                                   v-model="dateFilters"
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
import {onMounted, ref, computed, watch} from 'vue';
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
        const isLoading = ref(false);
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

// Выдача поиска_______________
        const materials = ref([]);
        const files = ref([]);

//Строка запроса______________________
        const sortObj = ref({
            field: 'created_at',
            direction: 'asc',
        });

        const searchObj = ref('');
        const extensionsObj = ref([]);
        const checkboxesObj = ref([]);
        const selectorsObj = ref([]);
        const dateFilters = ref({});

        const resetFilters = () => {
            checkboxesObj.value = [];
            extensionsObj.value = [];
            dateFilters.value = {};
        };

        const resetSelectors = () => {
           section.value = {
               ...section.value,
               fields: [...section.value.fields]
           };
           selectorsObj.value = [];
           searchObj.value = '';
        };

        const showResetSelectors = computed(() => {
            return !!(Object.keys(selectorsObj.value).length || searchObj.value);
        });

        const queryObject = computed(() => {

            const iterCheckboxes = checkboxesObj.value.map((item, i, arr) => ({[arr[i]] : 1 })).values();
            let checkboxes = {};
            for (let val of iterCheckboxes) {
                checkboxes = {...checkboxes, ...val};
            }

            return {
                search: searchObj.value,
                sort: sortObj.value,
                materials: extensionsObj.value.includes('materials'),
                extensions: extensionsObj.value.filter(item => item !== 'materials'),
                filter: {
                    ...checkboxes,
                    ...selectorsObj.value,
                    ...dateFilters.value,
                }
            }
        });

//Обработчики событий_______________________________________
        const toggleSort = (field, direction) => {
            sortObj.value = {
                    field,
                    direction
            }
        };

        const updateSelectorHandler = (newSelectors) => {
            selectorsObj.value = newSelectors;
        }

// Отправка поискового запроса_____________
        const updateMaterialsAndFiles = async (url, queryObject) => {
            try {
                const materialsAndFiles = await searchService.searchSectionPost(url, queryObject);
                materials.value = materialsAndFiles.data.materials;
                files.value = materialsAndFiles.data.files;
                currentPage.value = materialsAndFiles.current_page;
                totalPages.value = materialsAndFiles.last_page;
            } catch(e) {
                console.log(e);
            }
        }

        const updateSearchPage = async (id) => {
            try {
                section.value = await sectionsService.getSectionObject(id);
                resetSelectors();
                resetFilters();
                bcTitle.value = section.value.title;

            } catch(e) {
                console.log(e)
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
                        .searchSectionPost(`${router.currentRoute.value.params.id}/?page=${currentPage.value + 1}`, queryObject);
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
            sortObj,
            searchObj,
            extensionsObj,
            checkboxesObj,
            resetFilters,
            selectorsObj,
            queryObject,
            resetSelectors,
            showResetSelectors,
            addSearch,
            totalPages,
            currentPage,
            isPreloaderShown,
            dateFilters,
            filteredSectionFields,
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