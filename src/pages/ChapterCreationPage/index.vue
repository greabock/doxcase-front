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
                        <div class="btn-add">
                            <div class="btn-add__plus"></div>
                            <div class="btn-add__text">Добавить раздел</div>
                        </div>
                    </div>
                </div>

                <!-- Sections -->
                <div v-if="sections.length !== 0 && !isSectionsLoading">
                    <div class="sSections__body">
                        <div class="sSections__item">
                            <div class="row">
                                <div class="col-auto">
                                    <div class="sSections__count">1</div>
                                </div>
                                <div class="col fw-500 text-primary">О сервисе</div>
                                <div class="col-12 d-lg-none pb-3"></div>
                                <div class="sSections__col col-lg-auto col-md">
                                    <label class="custom-input form-check"
                                        ><input
                                            class="custom-input__input form-check-input"
                                            name="checkbox"
                                            type="checkbox"
                                            checked="checked"
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
                                            checked="checked"
                                        /><span class="custom-input__text form-check-label"
                                            >Отображать в навигации</span
                                        >
                                    </label>
                                </div>
                                <div class="col-md-auto">
                                    <div class="sSections__btn-control">
                                        <div class="btn-edit-sm btn-secondary">
                                            <svg class="icon icon-edit">
                                                <use xlink:href="img/svg/sprite.svg#edit"></use>
                                            </svg>
                                        </div>
                                        <div class="btn-edit-sm btn-danger">
                                            <svg class="icon icon-basket">
                                                <use xlink:href="img/svg/sprite.svg#basket"></use>
                                            </svg>
                                        </div>
                                        <div class="btn-edit-sm btn-secondary">
                                            <svg class="icon icon-chevron-up text-primary">
                                                <use xlink:href="img/svg/sprite.svg#chevron-up"></use>
                                            </svg>
                                        </div>
                                        <div class="btn-edit-sm btn-secondary">
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
                        <button class="btn btn-primary">Сохранить</button>
                        <button class="btn btn-outline-primary ms-2">Отмена</button>
                    </div>
                </div>

                <!-- No Sections block -->
                <div v-else-if="!sections.length && !isSectionsLoading" class="sSections section" id="sSections">
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
                <div v-else class="sections-loader__wrapper">
                    <div class="sections-loader__cont">Loading sections...</div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import {ref, onMounted} from 'vue';
import sectionsService from '@/services/sections.service';
export default {
    setup() {
        const sections = ref([]);
        const isSectionsLoading = ref(true);

        onMounted(async () => {
            try {
                sections.value = await sectionsService.getSections();
                isSectionsLoading.value = false;
            } catch (e) {
                isSectionsLoading.value = false;
                console.log(e);
            }
        });

        return {
            sections,
            isSectionsLoading,
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
</style>
