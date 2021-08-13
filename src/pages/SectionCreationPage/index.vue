<template>
    <main
        class="main-block"
        @click="setFiltersOpen(false)"
    >
        <!-- start sCabinet-->
        <section class="sCabinet section py-0" id="sCabinet">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-aside col-lg-auto d-flex flex-column">
                        <VBreadcrumb
                            :list="[
                                {
                                    link: '/',
                                    name: 'Главная',
                                },
                                {
                                    link: '/sections',
                                    name: 'Разделы',
                                },
                                {
                                    name: 'Создать новый раздел',
                                },
                            ]"
                        />
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
                                            type="text"
                                            placeholder="Заполнить"
                                        />
                                    </label>
                                </div>
                                <!-- +e.input-wrap-->
                                <p class="fw-500">Изображение раздела</p>
                                <div class="small text-dark mb-1">
                                    Только svg или png c соотношением сторон 1:1 не более 100 кБ
                                </div>
                                <uploader-image v-model="fileInput"></uploader-image>
                                <div class="mb-3">
                                    <label class="custom-input form-check"
                                        ><input
                                            v-model="section.is_dictionary"
                                            class="custom-input__input form-check-input"
                                            type="checkbox"
                                        /><span class="custom-input__text form-check-label"
                                            >Использовать как справочник</span
                                        >
                                    </label>
                                    <label class="custom-input form-check"
                                        ><input
                                            v-model="section.is_navigation"
                                            class="custom-input__input form-check-input"
                                            type="checkbox"
                                        /><span class="custom-input__text form-check-label"
                                            >Отображать в навигации</span
                                        >
                                    </label>
                                </div>
                                <div class="d-lg-none">
                                    <button
                                        @click="setFiltersOpen(true)"
                                        class="btn btn-outline-primary w-100"
                                        type="button"
                                        >
                                        Настроить фильтры для раздела
                                    </button>
                                </div>
                                <!-- Фильтры для разделов -->
<!--                                <FilterSections />-->

<!--                                <div class="form-wrap__footer">-->
<!--                                    <button-->
<!--                                        @click="createSection"-->
<!--                                        :class="{disabled: section.title === ''}"-->
<!--                                        class="btn btn-primary"-->
<!--                                    >-->
<!--                                        Сохранить <span class="d-none d-lg-inline">раздел</span>-->
<!--                                    </button>-->
<!--                                    <button @click="resetForm" class="btn btn-outline-primary">Отмена</button>-->
<!--                                </div>-->

                                <div class="form-wrap__modal-win" id="modal-filter">
                                    <p class="fw-500">Фильтры для раздела</p>

                                    <fields-to-filter @click.stop
                                        :fieldsArr="sortedFields"
                                        :isFiltersOpen="isFiltersOpen"
                                        @update-is-open="setFiltersOpen"
                                        @update-filter-sort="UpdateFilters"
                                    ></fields-to-filter>

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

                    </div>
                    <div class="col col--main">
                        <section class="sSectionMain section" id="sSectionMain">
                            <div class="row">
                                <div class="col">
                                    <h3>Конструктор полей для добавления материалов</h3>
                                </div>
                                <div class="col-auto d-none d-lg-block">
                                    <div class="btn-add"
                                         @click="setFieldToChange(null); setFieldModalVisible(true)">
                                        <div class="btn-add__plus"></div>
                                        <div class="btn-add__text">Добавить</div>
                                    </div>
                                </div>
                            </div>

                            <div class="sSectionMain__body">

                                <!-- Поле Название раздела -->
                                <div class="sSectionMain__item disabled">
                                    <div class="row">
                                        <div class="col-lg-auto col order-first">
                                            <div class="sSectionMain__count"></div>
                                        </div>
                                        <div class="sSectionMain__col-title col-lg-auto">
                                            <div class="text-dark small">Заголовок</div>
                                            <div class="fw-500 text-primary">Название материала</div>
                                        </div>
                                        <div class="sSectionMain__col-content col-lg">
                                            <div class="text-dark small">Содержание</div>
                                            <div class="sSectionMain__content">Введите название материала</div>
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

                                <fields-list
                                    @change-field="setFieldToChange"
                                    @sort-field-down="sortFieldDown"
                                    @sort-field-up="sortFieldUp"
                                    @remove-field="setFieldToRemove"
                                    :fieldsArr="sortedFields"
                                    :allSections="allSections"
                                    :allEnums="allEnums"
                                ></fields-list>
                            </div>

                            <div class="d-lg-none">
                                <div class="mb-3">
                                    <div class="btn-add">
                                        <div class="btn-add__plus"></div>
                                        <div
                                             @click="setFieldModalVisible(true)"
                                             class="btn-add__text"
                                        >Добавить</div>
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
            @addNewField="addNewField"
            :fieldsArrLength="section.fields.length"
            :fieldToChange="fieldToChange"
            :allEnums="allEnums"
            :allSections="allSections"
        ></new-field-form>

        <!-- Remove Field alert -->
        <div class="mock-modal__wrapper" v-show="isFieldAlertVisible">
            <div class="mock-modal__cont">
                <b class="mock-modal__closer" @click="setFieldAlertVisible(false)">x</b>
                <div class="mock-modal__header">
                    <h3>Удаление поля</h3>
                </div>
                <span
                >Вы действительно хотите удалить поле "{{ fieldToRemove?.title }}"?
            </span>
                <div class="mock-modal__buttons">
                    <v-button class="w-100" @click="removeField(fieldToRemove); setFieldAlertVisible(false)">Удалить</v-button>
                    <v-button :outline="true" class="w-100" @click="setFieldAlertVisible(false)">Отменить</v-button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import {ref, computed, onMounted} from 'vue';
import {v4 as uuidv4} from 'uuid';
import sectionsService from '@/services/sections.service';
import enumService from '@/services/enums.service';
import {useRouter} from 'vue-router';
import {sortByIndexDown} from '@/utils/sortByIndex';
import {sortByIndexUp} from '@/utils/sortByIndex';
import NewFieldForm from '@/pages/SectionCreationPage/NewFieldForm';
import VBreadcrumb from '@/ui/VBreadcrumb';
import FieldsList from '@/pages/SectionCreationPage/FieldsList';
import UploaderImage from '@/components/UploaderImage';
import FieldsToFilter from '@/pages/SectionCreationPage/FieldsToFilter';
import VButton from '@/ui/VButton';


export default {
    components: {FieldsToFilter, NewFieldForm, FieldsList, UploaderImage, VBreadcrumb, VButton},
    setup() {
        let initSection = {
            id: uuidv4(),
            title: '',
            is_dictionary: true,
            is_navigation: true,
            image: 'https://dev.cdi.msharks.ru/img/avatar-2.png',
            sort_index: 0,
            fields: [],
        };
        const allSections = ref([]);
        const allEnums = ref([]);
        const router = useRouter();
        const section = ref({...initSection});
        const sortedFields = computed(() => {
            return [...section.value.fields].sort((a, b) => a.sort_index - b.sort_index);
        });

        // Input File_____________________
        const fileInput = ref(null);
        const resetForm = () => {
            section.value = {...initSection};
            fileInput.value = null;
        };

        const isFieldModalVisible = ref(false);
        const setFieldModalVisible = (bool) => {
            isFieldModalVisible.value = bool;
        };

        const fieldToChange = ref(null);
        const setFieldToChange = (field) => {
            fieldToChange.value = {...field};
            if (fieldToChange.value) {
                setFieldModalVisible(true);
            }
        }

        const addNewField = (newField) => {
            const itemToUpdate = section.value.fields.find((item) => item.id === newField.id);
            if (itemToUpdate) {
                const idx = section.value.fields.indexOf(itemToUpdate);
                section.value.fields = [
                    ...sortedFields.value.slice(0, idx),
                    newField,
                    ...sortedFields.value.slice(idx + 1),
                ];
            } else {
                section.value.fields = [...sortedFields.value, newField];
            }
            setFieldModalVisible(false);
        };
        const createSection = async () => {
            try {
                await sectionsService.createSection(section.value);
                router.push(`/sections`);
            } catch (e) {
                console.log(e);
            }
        };

        const isFiltersOpen = ref(false);
        const setFiltersOpen = (bool) => {
            isFiltersOpen.value = bool;
        }

        const sortFieldUp = (item) => {
            section.value.fields = sortByIndexUp(item, sortedFields.value);
        };
        const sortFieldDown = (item) => {
            section.value.fields = sortByIndexDown(item, sortedFields.value);
        };
        const UpdateFilters = (newFields) => {
            section.value = {
                ...section.value,
                fields: newFields,
            };
        };
            const fieldToRemove = ref(null);
            const setFieldToRemove = (field) => {
                fieldToRemove.value = field;
                setFieldAlertVisible(true);
            }
            const removeField = (item) => {
                section.value.fields = [...sortedFields.value.filter((field) => field.id !== item.id)];
            };
            const isFieldAlertVisible = ref(false);
            const setFieldAlertVisible = (bool) => {
                isFieldAlertVisible.value = bool;
            }

            onMounted(async () => {
                try{
                    allEnums.value = await enumService.getEnums();
                    allSections.value = await sectionsService.getSections();
                } catch(e) {
                    console.log(e)
                }
            });

        return {
            allEnums,
            allSections,
            section,
            fileInput,
            resetForm,
            createSection,
            isFieldModalVisible,
            setFieldModalVisible,
            isFiltersOpen,
            setFiltersOpen,
            addNewField,
            sortedFields,
            sortFieldUp,
            sortFieldDown,
            UpdateFilters,
            setFieldToChange,
            fieldToChange,
            fieldToRemove,
            setFieldToRemove,
            isFieldAlertVisible,
            setFieldAlertVisible,
            removeField,
        };
    },
};
</script>

<style>
.file-uploader__cont > button {
    margin-right: 5px;
}
.sSectionMain__col-title {
    width: 25%;
}
.sSectionMain__col-content {
    width: 40%;
}
.sSectionMain__col-cut {
    width: 25%
}
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
