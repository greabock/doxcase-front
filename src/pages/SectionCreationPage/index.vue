<template>
    <main class="main-block">
        <!-- start sCabinet-->
        <section class="sCabinet section py-0" id="sCabinet">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-aside col-lg-auto d-flex flex-column">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <a href="/" itemprop="item"
                                        ><span itemprop="name">Главная</span> <meta itemprop="position" content="1"
                                    /></a>
                                </li>
                                <li class="breadcrumb-item">
                                    <a href="#" itemprop="item"
                                        ><span itemprop="name">Разделы</span> <meta itemprop="position" content="2"
                                    /></a>
                                </li>
                                <li class="breadcrumb-item active">
                                    <a href="#" itemprop="item"
                                        ><span itemprop="name">Создать новый проект/материал</span>
                                        <meta itemprop="position" content="3"
                                    /></a>
                                </li>
                            </ol>
                        </nav>
                        <!-- start sSectionAside-->
                        <div class="sSectionAside section" id="sSectionAside">
                            <div class="pb-1">
                                <h1>Новый раздел</h1>
                            </div>
                            <div class="form-wrap">
                                <div class="form-wrap__input-wrap form-group">
                                    <label
                                        ><span class="form-wrap__input-title">Название раздела</span
                                        ><input
                                            v-model="section.title"
                                            class="form-wrap__input form-control"
                                            name="text"
                                            type="text"
                                            placeholder="Заполнить"
                                        />
                                    </label>
                                </div>
                                <!-- +e.input-wrap-->
                                <p class="fw-500">Изображние раздела</p>
                                <div class="small text-dark mb-1">
                                    Только svg или png c соотношеием сторон 1:1 не более 100 кБ
                                </div>

                                <div class="file-uploader__wrapper">
                                    <input
                                        id="file-upload-input"
                                        type="file"
                                        ref="fileInput"
                                        @change="onFileSelected"
                                    />
                                    <div class="file-uploader__cont">
                                        <button class="form-wrap__btn-choose" @click="clickInput">Выбрать...</button>
                                        <span>{{ imageName ? imageName : 'Файл не выбран' }}</span>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="custom-input form-check"
                                        ><input
                                            v-model="section.is_dictionary"
                                            class="custom-input__input form-check-input"
                                            name="checkbox"
                                            type="checkbox"
                                            checked="checked"
                                        /><span class="custom-input__text form-check-label"
                                            >Использовать как справочник</span
                                        >
                                    </label>
                                    <label class="custom-input form-check"
                                        ><input
                                            v-model="section.is_navigation"
                                            class="custom-input__input form-check-input"
                                            name="checkbox"
                                            type="checkbox"
                                            checked="checked"
                                        /><span class="custom-input__text form-check-label"
                                            >Отображать в навигации</span
                                        >
                                    </label>
                                </div>
                                <div class="d-lg-none">
                                    <button
                                        class="btn btn-outline-primary w-100"
                                        type="button"
                                        data-fancybox="data-fancybox"
                                        data-src="#modal-filter"
                                    >
                                        Настроить фильтры для раздела
                                    </button>
                                </div>
                                <!-- Фильтры для разделов -->
                                <div class="form-wrap__modal-win" id="modal-filter">
                                    <p class="fw-500">Фильтры для раздела</p>
                                    <div class="form-wrap__text small text-dark">
                                        Выберите допустимые для фильтрации поля&nbsp;из&nbsp;добавленных
                                    </div>
                                    <div class="form-wrap__input-wrap form-group">
                                        <div class="form-wrap__input form-select toggle-dropdown">Выберите поле</div>
                                        <div class="form-wrap__dropdown">
                                            <div class="form-wrap__dropdown-item">
                                                <label class="dropdown-custom-input">
                                                    <input type="checkbox" name="" /><span
                                                        class="dropdown-custom-input__title"
                                                    >
                                                        Контрагент</span
                                                    ><span class="dropdown-custom-input__circle"></span>
                                                </label>
                                            </div>
                                            <div class="form-wrap__dropdown-item">
                                                <label class="dropdown-custom-input">
                                                    <input type="checkbox" name="" /><span
                                                        class="dropdown-custom-input__title"
                                                    >
                                                        Локация</span
                                                    ><span class="dropdown-custom-input__circle"></span>
                                                </label>
                                            </div>
                                            <div class="form-wrap__dropdown-item">
                                                <label class="dropdown-custom-input">
                                                    <input type="checkbox" name="" /><span
                                                        class="dropdown-custom-input__title"
                                                        >Обучение</span
                                                    ><span class="dropdown-custom-input__circle"></span>
                                                </label>
                                            </div>
                                            <div class="form-wrap__dropdown-item">
                                                <label class="dropdown-custom-input">
                                                    <input type="checkbox" name="" /><span
                                                        class="dropdown-custom-input__title"
                                                        >Файлы от менеджера</span
                                                    ><span class="dropdown-custom-input__circle"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-wrap__footer">
                                        <button
                                            @click="createSection"
                                            :class="{disabled: section.title === ''}"
                                            class="btn btn-primary"
                                        >
                                            Сохранить <span class="d-none d-lg-inline">раздел</span>
                                        </button>
                                        <button @click="resetForm" class="btn btn-outline-primary">Отмена</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end sSectionAside-->
                    </div>
                    <div class="col col--main">
                        <!-- start sSectionMain-->
                        <section class="sSectionMain section" id="sSectionMain">
                            <div class="row">
                                <div class="col">
                                    <h3>Конструктор полей для добавления материалов</h3>
                                </div>
                                <div class="col-auto d-none d-lg-block">
                                    <div class="btn-add" @click="setFieldModalVisible(true)">
                                        <div class="btn-add__plus"></div>
                                        <div class="btn-add__text">Добавить</div>
                                    </div>
                                </div>
                            </div>
                            <!-- Material title Field -->
                            <div class="sSectionMain__body">
                                <div class="sSectionMain__item disabled">
                                    <div class="row">
                                        <div class="col-lg-auto col order-first">
                                            <div class="sSectionMain__count">1</div>
                                        </div>
                                        <div class="sSectionMain__col-title col-lg-auto">
                                            <div class="text-dark small">Заголовок</div>
                                            <div class="fw-500 text-primary">Название материала</div>
                                        </div>
                                        <div class="sSectionMain__col-content col-lg">
                                            <div class="text-dark small">Содержание</div>
                                            <div class="sSectionMain__content">
                                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis nam
                                                amet assumenda
                                            </div>
                                        </div>
                                        <div class="sSectionMain__col-cut col-auto order-first order-lg-0">
                                            <div class="text-dark small d-none d-lg-block">Тип поля</div>
                                            <div class="sSectionMain__content">Короткое текстовое поле</div>
                                        </div>
                                        <div class="col-12 d-lg-none pb-3"></div>
                                        <div class="col-lg-auto">
                                            <div class="sSectionMain__btn-control"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="d-lg-none">
                                <div class="mb-3">
                                    <div class="btn-add">
                                        <div class="btn-add__plus"></div>
                                        <div class="btn-add__text" @click="setFieldModalVisible(true)">Добавить</div>
                                    </div>
                                </div>
                                <div class="sSectionAside__footer">
                                    <button class="btn btn-primary">Сохранить раздел</button>
                                    <button class="btn btn-outline-primary ms-2">Отмена</button>
                                </div>
                            </div>
                        </section>
                        <!-- end sSectionMain-->
                    </div>
                </div>
            </div>
        </section>

        <new-field-form
            :isFieldModalVisible="isFieldModalVisible"
            @updateFieldModalVisible="setFieldModalVisible"
        ></new-field-form>

        <!-- end sCabinet-->
    </main>
</template>

<script>
import {ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import sectionsService from '@/services/sections.service';
import {useRouter} from 'vue-router';
import NewFieldForm from '@/pages/SectionCreationPage/NewFieldForm';
export default {
    components: {NewFieldForm},
    setup() {
        let initUser = {
            id: uuidv4(),
            title: '',
            is_dictionary: true,
            is_navigation: true,
            image: 'https://dev.cdi.msharks.ru/img/avatar-2.png',
            sort_index: 0,
            fields: [],
        };
        const section = ref({...initUser});

        // Input File_________
        const fileInput = ref(null);
        const imageName = ref('');
        const onFileSelected = (e) => {
            imageName.value = e.target.files[0].name;
        };
        const clickInput = () => {
            fileInput.value.click();
        };

        const resetForm = () => {
            section.value = {...initUser};
            imageName.value = '';
            fileInput.value = null;
        };
        const isFieldModalVisible = ref(false);
        const setFieldModalVisible = (bool) => {
            isFieldModalVisible.value = bool;
        };
        const createSection = async () => {
            try {
                const newSection = await sectionsService.createSection(section.value);
                // if (newSection?.id) {
                const router = useRouter();
                await router.push(`/sections/${newSection.id}`);
                // }
            } catch (e) {
                console.log(e);
            }
        };

        return {
            section,
            onFileSelected,
            imageName,
            fileInput,
            clickInput,
            resetForm,
            createSection,
            isFieldModalVisible,
            setFieldModalVisible,
        };
    },
};
</script>

<style scoped>
#file-upload-input {
    visibility: hidden;
    height: 40px;
}
.file-uploader__wrapper {
    position: relative;
    height: 40px;
    margin-bottom: 20px;
}
.file-uploader__cont {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
}
.file-uploader__cont > button {
    margin-right: 5px;
}
</style>
