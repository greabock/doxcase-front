<template>

    <loader v-if="isLoading"></loader>

    <main v-else class="main-block">
        <!-- start sSearchResult-->
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
                        <div class="sSearchResult__items">
                            <div class="search-item">
                                <div class="row">
                                    <div class="col">
                                        <div class="h6">Название материала</div>
                                        <div class="text-dark small">Опубликовано 01.01.2020<span class="d-sm-none text-primary">
														<svg class="icon icon-doc ">
															<use xlink:href="/img/svg/sprite.svg#doc"></use>
														</svg>25</span></div>
                                    </div>
                                    <div class="col-auto align-self-center d-none d-sm-block">
                                        <div class="text-dark small">Документов 25</div>
                                    </div>
                                    <div class="col-auto align-self-sm-center">
                                        <div class="btn-edit-sm btn-primary">
                                            <svg class="icon icon-chevron-down ">
                                                <use xlink:href="/img/svg/sprite.svg#chevron-down"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="search-item">
                                <div class="row">
                                    <div class="col">
                                        <div class="h6">Название материала</div>
                                        <div class="text-dark small">Опубликовано 01.01.2020<span class="d-sm-none text-primary">
														<svg class="icon icon-doc ">
															<use xlink:href="/img/svg/sprite.svg#doc"></use>
														</svg>25</span></div>
                                    </div>
                                    <div class="col-auto align-self-center d-none d-sm-block">
                                        <div class="text-dark small">Документов 25</div>
                                    </div>
                                    <div class="col-auto align-self-sm-center">
                                        <div class="btn-edit-sm btn-primary">
                                            <svg class="icon icon-chevron-down ">
                                                <use xlink:href="/img/svg/sprite.svg#chevron-down"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="search-item search-item--open">
                                <div class="row">
                                    <div class="col">
                                        <div class="h6">PRS - Почта Банк - ЭДО </div>
                                        <div class="text-dark small">Опубликовано 01.01.2020<span class="d-sm-none text-primary">
														<svg class="icon icon-doc ">
															<use xlink:href="/img/svg/sprite.svg#doc"></use>
														</svg>25</span></div>
                                    </div>
                                    <div class="col-auto align-self-center d-none d-sm-block">
                                        <div class="text-dark small">Документов 25</div>
                                    </div>
                                    <div class="col-auto align-self-sm-center">
                                        <div class="btn-edit-sm btn-primary">
                                            <svg class="icon icon-chevron-down ">
                                                <use xlink:href="/img/svg/sprite.svg#chevron-down"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="search-item__dropdown pt-3">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <div class="search-item__panel">
                                                <div class="row">
                                                    <div class="col-auto text-primary">Заголовок </div>
                                                    <div class="col">Текст из короткого поля длинее для типа отображен ...</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="search-item__panel">
                                                <div class="row">
                                                    <div class="col-auto text-primary">Заголовок </div>
                                                    <div class="col">Текст из короткого поля длинее для типа отображенasd sda dsad asd sadasdsdasdasd</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="search-item__panel">
                                                <div class="row">
                                                    <div class="col-auto text-primary">Дата</div>
                                                    <div class="col">18.08.2021</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="search-item__panel">
                                                <div class="row">
                                                    <div class="col-auto text-primary">Чекбокс</div>
                                                    <div class="col"> да</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="small">Бесплатные почтовые сервисы могут также отслеживать ваши электронные письма развлекательные события. Многие услуги, такие как разработка сайтов, мультимедиа, аккредитацию участников, колл-центры и службу</div>
                                </div>
                            </div>
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
                                <div class="sSearchResult__aside-group">
                                    <div class="fw-500 pb-3">Сортировать</div>

                                    <!-- Сортировка по дате -->
                                    <div
                                        v-if="queryObject.sort.created_at === 'asc'"
                                        @click="toggleSortByCreatedAt"
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
                                        v-else
                                        @click="toggleSortByCreatedAt"
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
                                        v-if="queryObject.sort.name === 'asc'"
                                        @click="toggleSortByName"
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
                                        v-else
                                        @click="toggleSortByName"
                                        class="sSearchResult__filter-item">
                                        <div class="sSearchResult__filter-btns">
                                            <div class="sSearchResult__filter-btn active">
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
                                        <div class="sSearchResult__filter-result-text">от Я до А
                                        </div>
                                    </div>

                                </div>
                                <div class="sSearchResult__aside-group">

                                    <div class="fw-500 pb-3">Формат</div>
                                    <div class="row mb-3">
                                        <div class="col-lg-4 col-md-6 mb-2">
                                            <label class="custom-input form-check">
                                                <input
                                                    v-model='queryObject.extensions'
                                                    value='doc'
                                                    class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                                                />
                                                <span class="custom-input__text form-check-label">doc</span>
                                            </label>
                                        </div>

                                    </div>
                                    <a class="small fw-500">Показать все</a>
                                </div>

                                <div class="sSearchResult__aside-group">
                                    <label class="custom-input form-check">
                                        <input
                                            class="custom-input__input form-check-input" name="checkbox" type="checkbox"/>
                                        <span class="custom-input__text form-check-label">Материал обучения</span>
                                    </label>
                                </div>
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
// import {API_URL} from '@/globals';

export default {
    components: { Loader, VBreadcrumb,  SectionSearchSelectors},
    setup() {

        const router = useRouter();
        const isLoading = ref(false);
        const section = ref({})

        // Выдача поиска_______________
        const materials = ref([]);
        const files = ref([]);

        const fieldsToSelectors = computed(() => {
            if (section.value.fields?.length) {
                return [...section.value.fields].sort( field => !!field.filter_sort_index)
            } else {
                return [];
            }

        })

        const queryObject = ref({
            search: '',
            sort: {
                name: 'asc',
                created_at: 'asc'
            },
            extensions: [],
            filter: {
            }
        });

        const toggleSortByName = () => {
            if (queryObject.value.sort.name === 'asc') {
                queryObject.value = {
                    ...queryObject.value,
                    sort: {
                        ...queryObject.value.sort,
                        name: 'desc'
                    }
                }
            } else {
                queryObject.value = {
                    ...queryObject.value,
                    sort: {
                        ...queryObject.value.sort,
                        name: 'asc'
                    }
                }
            }
        }
        const toggleSortByCreatedAt = () => {
            if (queryObject.value.sort.created_at === 'asc') {
                queryObject.value = {
                    ...queryObject.value,
                    sort: {
                        ...queryObject.value.sort,
                        created_at: 'desc'
                    }
                }
            } else {
                queryObject.value = {
                    ...queryObject.value,
                    sort: {
                        ...queryObject.value.sort,
                        created_at: 'asc'
                    }
                }
            }
        }
        const updateFilterHandler = (option) => {
                queryObject.value = {
                    ...queryObject.value,
                    filter: {
                           ...queryObject.value.filter,
                        [option.name]: option.value
                }
            }
        }

        onMounted(async () => {
            try {
                isLoading.value = true;
                section.value = await sectionsService.getSectionObject(router.currentRoute.value.params.id);
                console.log(section.value);
                const materialsAndFiles = await searchService.searchSection(router.currentRoute.value.params.id);
                materials.value = materialsAndFiles.materials;
                files.value = materialsAndFiles.files;
                isLoading.value = false;
            } catch(e) {
                console.log(e)
                isLoading.value = false;
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
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        }

        console.log(serialize({
            foo: "hi there",
            bar: {
                blah: 123,
                quux: [1, 2, 3]
            }
        }));

        return {
            isLoading,
            queryObject,
            toggleSortByCreatedAt,
            toggleSortByName,
            fieldsToSelectors,
            updateFilterHandler,
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