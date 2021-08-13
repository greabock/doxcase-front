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
                                    link: '#',
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
                                            @click="updateSection"
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
                                         @click="setFieldToChange(null), setFieldModalVisible(true)">
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
                                    @remove-field="removeField"
                                    :fieldsArr="sortedFields"
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
        ></new-field-form>

        <!-- end sCabinet-->
    </main>
</template>

<script>
import {ref, computed, onMounted} from 'vue';
import {v4 as uuidv4} from 'uuid';
import sectionsService from '@/services/sections.service';
import {useRouter} from 'vue-router';
import {sortByIndexDown} from '@/utils/sortByIndex';
import {sortByIndexUp} from '@/utils/sortByIndex';
import NewFieldForm from '@/pages/SectionCreationPage/NewFieldForm';
import VBreadcrumb from '@/ui/VBreadcrumb';
import FieldsList from '@/pages/SectionCreationPage/FieldsList';
import UploaderImage from '@/components/UploaderImage';
import FieldsToFilter from '@/pages/SectionCreationPage/FieldsToFilter';

export default {
    components: {FieldsToFilter, NewFieldForm, FieldsList, UploaderImage, VBreadcrumb},
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
        const updateSection = async () => {
            try {
                await sectionsService.updateSection(section.value);
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
        const removeField = (item) => {
            section.value.fields = [...sortedFields.value.filter((field) => field.id !== item.id)];
        };
        const UpdateFilters = (newFields) => {
            section.value = {
                ...section.value,
                fields: newFields,
            };
        };

        onMounted(async () => {
            try {
                section.value = await sectionsService.getSectionObject(router.currentRoute.value.params.id);
            } catch(e) {
                console.log(e);
            }
        })

        return {
            section,
            fileInput,
            resetForm,
            updateSection,
            isFieldModalVisible,
            setFieldModalVisible,
            isFiltersOpen,
            setFiltersOpen,
            addNewField,
            sortedFields,
            sortFieldUp,
            sortFieldDown,
            removeField,
            UpdateFilters,
            setFieldToChange,
            fieldToChange,
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

</style>
