<template>
    <div class="sSearchResult__items">
        <div class="search-item search-item--open">
            <div class="row">
                <div class="col-auto">
                    <div class="search-item__icon-wrap">
                        <img alt='' src="/img/@1x/avatar-2.png" />
                    </div>
                </div>
                <div class="col">
                    <div class="h6">PRS - Почта Банк - ЭДО </div>
                    <div class="text-dark small">Опубликовано 01.01.2020
                        <span class="d-sm-none text-primary">
                            <svg class="icon icon-doc ">
                                <use xlink:href="/img/svg/sprite.svg#doc"></use>
                            </svg>25
                        </span>
                    </div>
                </div>
                <div class="col-auto align-self-center d-none d-sm-block">
                    <div class="text-dark small">Документов 25</div>
                </div>
                <div class="col-auto align-self-sm-center">
                    <div
                        @click="closeToggleHandler"
                        class="btn-edit-sm btn-primary">
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
</template>

<script>
import {ref} from 'vue';

export default {
    props: {
        allSections: Array,
    },

    setup() {
        const closeToggleHandler = (e) => {
            (e.target.closest('.search-item').classList
                .toggle('search-item--open'));
        };

        const docSnippetsArr = ref([])

        return {
            closeToggleHandler,
            docSnippetsArr,
        }
    }

};
</script>

<style scoped>
.search-item--open .search-item__dropdown {
    display: block;
}
.search-item__dropdown {
    display: none;
}
.search-item__icon-wrap {
    width: 50px;
}
.search-item__icon-wrap IMG {
    max-width: 100%;
    height:auto;
}
</style>