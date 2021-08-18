<template>

    <loader v-if="isLoading"></loader>
    <main v-else class="main-block">
        <!-- start sSearchResult-->
        <span :style='{fontSize: "12px"}'>{{resultString}}</span>
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
                                    name: 'Поиск по разделу'
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
                                        <button class="search-block__btn" type="submit">
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
                                    :fieldsArray="fieldsToSelectors"
                                    @updateFilter="updateFilterHandler"
                                ></section-search-selectors>
                            </div>
                            <div class="mb-3">
                                <div class="sSearchResult__btn-text">
                                    <svg class="icon icon-close ">
                                        <use xlink:href="/img/svg/sprite.svg#close"></use>
                                    </svg><span class="ms-2">очистить фильтр</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="btn-add">
                                    <div class="btn-add__plus">
                                    </div>
                                    <div class="btn-add__text">Добавить материал
                                    </div>
                                </div>
                            </div>
                        </div>

 <!-- Результаты поиска -->
                        <search-results></search-results>

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
                                <upload-doc-types
                                  @updateExtensions="updateExtensionsHandler"
                                >
                                </upload-doc-types>

<!-- Чекбоксы -->
                                <checkbox-filters
                                    :fieldsArray="fieldsToSelectors"
                                    @updateFilter="updateFilterHandler"
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
import {onMounted, ref, computed} from 'vue';
import Loader from '@/components/Loader';
import VBreadcrumb from '@/ui/VBreadcrumb';
import sectionsService from '@/services/sections.service';
import searchService from '@/services/search.service';
import {useRouter} from 'vue-router';
import SectionSearchSelectors from '@/pages/SectionSearchPage/SectionSearchSelectors';
import UploadDocTypes from '@/pages/SectionSearchPage/UploadDocTypes';
import CheckboxFilters from '@/pages/SectionSearchPage/CheckboxFilters';
import SearchResults from '@/pages/SectionSearchPage/SearchResults';
// import {API_URL} from '@/globals';

export default {
    components: { Loader, VBreadcrumb,  SectionSearchSelectors, UploadDocTypes, CheckboxFilters, SearchResults},
    setup() {

        const router = useRouter();
        const isLoading = ref(false);
        const section = ref({});
        const allSections = ref([]);

        // Выдача поиска_______________
        const materials = ref([]);
        const files = ref([]);

        const fieldsToSelectors = computed(() => {
            if (section.value.fields?.length) {
                return [...section.value.fields].filter( field => !!field.filter_sort_index)
            } else {
                return [];
            }
        })

        const queryObject = ref({
            search: '',
            sort: {
                field: 'created_at',
                direction: 'asc',
            },
            extensions: [],
            filter: {
            }
        });

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

        const toggleSort = (field, direction) => {
                queryObject.value = {
                    ...queryObject.value,
                    sort: {
                        field,
                        direction
                    }
                }
            updateMaterialsAndFiles(router.currentRoute.value.params.id + resultString.value);
        };
        const updateFilterHandler = (option) => {
                queryObject.value = {
                    ...queryObject.value,
                    filter: {
                           ...queryObject.value.filter,
                        [option.name]: option.value
                }
            }
            updateMaterialsAndFiles(router.currentRoute.value.params.id + resultString.value);
        }
        const updateExtensionsHandler = (extensions) => {
            queryObject.value = {
                ...queryObject.value,
                extensions
            }
            updateMaterialsAndFiles(router.currentRoute.value.params.id + resultString.value);
        }

        const updateMaterialsAndFiles = async (url) => {
            console.log(url);
            isLoading.value = true;
            const materialsAndFiles = await searchService.searchSection(url);
            materials.value = materialsAndFiles.materials;
            files.value = materialsAndFiles.files;
            isLoading.value = false;
        }

        onMounted(async () => {
            try {
                isLoading.value = true;
                allSections.value = await sectionsService.getSections();
                section.value = await sectionsService.getSectionObject(router.currentRoute.value.params.id);
                console.log('Section: ', section.value);
                await updateMaterialsAndFiles(router.currentRoute.value.params.id);
                isLoading.value = false;
            } catch(e) {
                console.log(e)
                isLoading.value = false;
            }
        });

        return {
            isLoading,
            queryObject,
            toggleSort,
            fieldsToSelectors,
            updateFilterHandler,
            updateExtensionsHandler,
            allSections,
            resultString,
            searchService,
            materials,
            files,
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