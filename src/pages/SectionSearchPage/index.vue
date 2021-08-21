<template>

    <loader v-show="isLoading"></loader>
    <main class="main-block">
<!--        <span :style='{fontSize: "12px"}'>{{resultString}}</span>-->
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
                                                v-model="queryObject.search"
                                                class="search-block__input form-control"
                                                name="text"
                                                type="text"
                                                placeholder="Поиск"/>
                                        </div>
                                        <!-- +e.input-wrap-->
                                        <button
                                            @click.prevent="updateMaterialsAndFiles( $router.currentRoute.value.params.id, queryObject)"
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
                            <div class="mb-3">
 <!-- Селекторы -->
                                <section-search-selectors
                                    :fieldsArray="selectorOptionsArr"
                                    @updateSelector="updateSelectorHandler"
                                ></section-search-selectors>
                            </div>
                            <div class="mb-3">
                                <div class="sSearchResult__btn-text">
                                    <svg class="icon icon-close ">
                                        <use xlink:href="/img/svg/sprite.svg#close"></use>
                                    </svg><span class="ms-2">очистить фильтр</span>
                                </div>
                            </div>
                        </div>

 <!-- Результаты поиска -->
                        <search-results
                            :allSections="allSections"
                            :materialsArr="materials"
                            :filesArr="files"
                        ></search-results>

                    </div>
                    <div class="col-aside col-lg-auto d-flex flex-column">
                        <div class="sSearchResult__aside">
                            <div class="sSearchResult__aside-head">
                                <div class="row">
                                    <div class="col">
                                        <div class="sSearchResult__btn-text">
                                            <svg class="icon icon-close ">
                                                <use xlink:href="/img/svg/sprite.svg#close"></use>
                                            </svg><span class="ms-2">очистить фильтр</span>
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
 <!-- Сортировка по дате -->
                                <div class="sSearchResult__aside-group">
                                    <div class="fw-500 pb-3">Сортировать</div>

                                    <div
                                        v-if="queryObject.sort?.field === 'created_at' && queryObject.sort?.direction === 'asc'"
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
                                        v-else-if="queryObject.sort?.field === 'created_at' && queryObject.sort?.direction === 'desc'"
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
                                        v-else-if="queryObject.sort?.field === 'name'"
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
                                        v-if="queryObject.sort?.field === 'name' && queryObject.sort?.direction === 'asc'"
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
                                        v-else-if="queryObject.sort?.field === 'name' && queryObject.sort?.direction === 'desc'"
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
                                        v-if="queryObject.sort?.field === 'created_at'"
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
                                  @updateExtensions="updateExtensionsHandler"
                                  @updateIsMaterials="updateIsMaterialsHandler"
                                  :activeExtensions="queryObject.extensions"
                                >
                                </files-types>

<!-- Чекбоксы -->
                                <checkbox-filters
                                    :fieldsArray="section.fields"
                                    @updateCheckbox="updateCheckboxHandler"
                                >
                                </checkbox-filters>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end sSearchResult-->
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
// import UploadDocTypes from '@/pages/SectionSearchPage/UploadDocTypes';
import FilesTypes from '@/pages/SectionSearchPage/FilesTypes';
import CheckboxFilters from '@/pages/SectionSearchPage/CheckboxFilters';
import SearchResults from '@/pages/SectionSearchPage/SearchResults';
import enumsService from '@/services/enums.service';


export default {
    components: { Loader, VBreadcrumb,  SectionSearchSelectors, FilesTypes, CheckboxFilters, SearchResults},
    setup() {

        const router = useRouter();
        const isLoading = ref(false);
        const section = ref({});
        const allSections = ref([]);
        const bcTitle = ref('');

// Выдача поиска_______________
        const materials = ref([]);
        const files = ref([]);

//Строка запроса______________________
        const initQueryObject = {
            search: '',
            sort: {
                field: 'created_at',
                direction: 'asc',
            },
            materials: false,
            extensions: [],
            checkboxes: {},
            selectors: {}
        }
        const queryObject = ref(initQueryObject);
        const serialize = (obj, prefix) => {
            const str = [];

            for (const p in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, p)) {
                    const k = prefix ? prefix + "[" + p + "]" : p,
                        v = obj[p];
                    str.push((v !== null && typeof v === "object") ?
                        serialize(v, k) :
                        k + "=" + v);
                }
            }
            return str.join("&");
        }
        const resultString = computed(() => {
            return '?' + serialize(queryObject.value);
        });

//Селекторы____________________________________
        const selectorOptionsArr = ref([]);
        const fieldsToSelectors = computed(() => {
            if (section.value.fields?.length) {
                return [...section.value.fields].filter( field => !!field.filter_sort_index)
            } else {
                return [];
            }
        })
        const createSelectOption = (field) => {
            selectorOptionsArr.value.push({
                id: field.id,
                title: field.title,
                options: (field.type.of).map(item => (
                    {
                        title: item,
                        value: item
                    }))
            });
        };
        const createEnumOption = async (field, id) => {
            try {
                const enumObj = await enumsService.getEnumsObject(id);
                selectorOptionsArr.value.push({
                    id,
                    title: field.title,
                    options: (enumObj.values).map(item => (
                        {
                            title: item.title,
                            value: item.id
                        }))
                });
            } catch (e) {
                console.log(e);
            }
        };
        const createDictionaryOption = async (field, id) => {
            try {
                const sectionMaterials = await sectionsService.getSectionMaterials(id);
                selectorOptionsArr.value.push({
                    id,
                    title: field.title,
                    options: (sectionMaterials.data).map(item => (
                        {
                            title: item.name,
                            value: item.id
                        }))
                });
            } catch (e) {
                console.log(e);
            }
        };
        watch(fieldsToSelectors, async (newVal) => {
            if (newVal.length) {
                newVal.map( async (field) => {

                    switch (field.type.name) {
                        case 'Select':
                            createSelectOption(field);
                            break;

                        case 'Enum':
                            await createEnumOption(field, field.type.of);
                            break;

                        case 'Dictionary':
                            await createDictionaryOption(field, field.type.of);
                            break;

                        case 'List':
                            switch (field.type.of.name) {

                                case 'Enum':
                                    await createEnumOption(field, field.type.of.of);
                                    break;

                                case 'Dictionary':
                                    await createDictionaryOption(field, field.type.of.of);
                                    break;
                            }
                    }
                });
            }
        });


//Обработчики событий_______________________________________
        const toggleSort = (field, direction) => {
                queryObject.value = {
                    ...queryObject.value,
                    sort: {
                        field,
                        direction
                    }
                }
            updateMaterialsAndFiles();
        };
        const updateExtensionsHandler = (extensions) => {
            queryObject.value = {
                ...queryObject.value,
                extensions
            }
        }
        const updateCheckboxHandler = ({name, value}) => {
            queryObject.value = {
                ...queryObject.value,
                checkboxes: {
                    ...queryObject.value.checkboxes,
                    [name]: value,
                }
            }
        };
        const updateSelectorHandler = ({name, value}) => {
            queryObject.value = {
                ...queryObject.value,
                selectors: {
                    ...queryObject.value.selectors,
                    [name]: value
                }
            }
        };
        const updateIsMaterialsHandler = (bool) => {
            queryObject.value = {
                ...queryObject.value,
                materials:bool,
            }
        }

// Отправка поискового запроса_____________
        const updateMaterialsAndFiles = async (url, queryObject) => {

            const mergedQueryObject = {
                search: queryObject.search,
                sort: queryObject.sort,
                materials: queryObject.materials,
                extensions: queryObject.extensions,
                filters: {
                    ...queryObject.selectors,
                    ...queryObject.checkboxes,
                }
            }
            try {
                isLoading.value = true;
                const materialsAndFiles = await searchService.searchSectionPost(url, mergedQueryObject);
                materials.value = materialsAndFiles.materials;
                files.value = materialsAndFiles.files;
                console.log(files.value);
                isLoading.value = false;
            } catch(e) {
                console.log(e);
                isLoading.value = false;
            }

        }
        const updateSearchPage = async (url) => {

            try {
                isLoading.value = true;

                section.value = {};
                materials.value = [];
                files.value = [];
                selectorOptionsArr.value = [];
                queryObject.value = initQueryObject;

                allSections.value = await sectionsService.getSections();
                section.value = await sectionsService.getSectionObject(url);
                bcTitle.value =  section.value.title;
                await updateMaterialsAndFiles(router.currentRoute.value.params.id, queryObject.value);
                isLoading.value = false;
            } catch(e) {
                console.log(e)
                isLoading.value = false;
            }
        };
        watch( queryObject, (newVal) => {
            updateMaterialsAndFiles(router.currentRoute.value.params.id, newVal)
        })
        watch( router.currentRoute, async () => {
            await updateSearchPage(router.currentRoute.value.params.id);
        });
        onMounted(async () => {
            await updateSearchPage(router.currentRoute.value.params.id);
        });

        return {
            isLoading,
            bcTitle,
            queryObject,
            toggleSort,
            fieldsToSelectors,
            updateCheckboxHandler,
            updateSelectorHandler,
            updateExtensionsHandler,
            section,
            allSections,
            resultString,
            searchService,
            materials,
            files,
            selectorOptionsArr,
            updateMaterialsAndFiles,
            updateIsMaterialsHandler,
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
</style>