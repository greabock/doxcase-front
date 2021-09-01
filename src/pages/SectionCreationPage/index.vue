<template>
    <main
        class="main-block"
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
                                            maxLength="50"
                                        />
                                    </label>
                                </div>
                                <!-- +e.input-wrap-->
                                <p class="fw-500">Изображение раздела</p>
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
                                <div class="d-lg-none mb-3">
                                    <button
                                        @click="setMobFiltersShow(!isMobFiltersShow)"
                                        class="btn btn-outline-primary w-100"
                                        type="button"
                                        >
                                        Настроить фильтры для раздела
                                    </button>
                                </div>

                                <div
                                    class="form-wrap__modal-win"
                                    :class="{'mobile-filters-show': isMobFiltersShow}"
                                >
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
                                        <button
                                            @click="resetForm"
                                            class="btn btn-outline-primary"
                                        >Отмена</button>
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
                                         @click.stop="setFieldToChange({}); setFieldModalVisible(true)"
                                    >
                                        <div class="btn-add__plus"></div>
                                        <div class="btn-add__text">Добавить</div>
                                    </div>
                                </div>
                            </div>

                            <div class="sSectionMain__body">

                                <!-- Поле Название раздела -->

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
                                             @click="setFieldToChange({}); setFieldModalVisible(true)"
                                             class="btn-add__text"
                                        >Добавить</div>
                                    </div>
                                </div>
                                <div class="sSectionAside__footer">
                                    <button
                                        @click="createSection"
                                        :class="{disabled: section.title === ''}"
                                        class="btn btn-primary"
                                    >Сохранить раздел</button>
                                    <button
                                        @click="resetForm"
                                        class="btn btn-outline-primary ms-2"
                                    >Отмена</button>
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
        <modal-window
            @click="setFieldAlertVisible(false)"
            v-model="isFieldAlertVisible"
            maxWidth="400px"
        >
            <div class="modal-window__header">
                <h3>Удаление поля</h3>
            </div>
            <span
            >Вы действительно хотите удалить поле "{{ fieldToRemove?.title }}"?
            </span>
            <div class="modal-window__buttons">
                <v-button class="w-100" @click="removeField(fieldToRemove); setFieldAlertVisible(false)">Удалить</v-button>
                <v-button :outline="true" class="w-100" @click="setFieldAlertVisible(false)">Отменить</v-button>
            </div>
        </modal-window>

        <loader
            v-if="isLoading"
        >
        </loader>

    </main>
</template>

<script>
import {ref, computed, onMounted} from 'vue';
import {v4 as uuidv4} from 'uuid';
import sectionsService from '@/services/sections.service';
import filesService from '@/services/files.service';
import enumService from '@/services/enums.service';
import {useRouter} from 'vue-router';
import Loader from "@/components/Loader";
import {sortByIndexDown} from '@/utils/sortByIndex';
import {sortByIndexUp} from '@/utils/sortByIndex';
import NewFieldForm from '@/pages/SectionCreationPage/NewFieldForm';
import VBreadcrumb from '@/ui/VBreadcrumb';
import FieldsList from '@/pages/SectionCreationPage/FieldsList';
import UploaderImage from '@/components/UploaderImage';
import FieldsToFilter from '@/pages/SectionCreationPage/FieldsToFilter';
import VButton from '@/ui/VButton';
import ModalWindow from '@/components/ModalWindow';

export default {
    components: {FieldsToFilter, NewFieldForm, FieldsList, UploaderImage, VBreadcrumb, VButton, ModalWindow, Loader},
        setup() {
        let initSection = {
            id: uuidv4(),
            title: '',
            is_dictionary: true,
            is_navigation: true,
            image: null,
            sort_index: 0,
            fields: [],
        };
        const isLoading = ref(false);
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
            // section.value = {...initSection};
            // fileInput.value = null;
            router.push('/sections');
        };

        const isFieldModalVisible = ref(false);
        const setFieldModalVisible = (bool) => {
            isFieldModalVisible.value = bool;
        };

        const fieldToChange = ref({});
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
                isLoading.value = true;
                if (fileInput.value) {
                    const formData = new FormData();
                    formData.append('files[]', fileInput.value)

                    const imageResp =  await filesService.uploadFiles(formData);
                    if (imageResp) {
                        section.value.image = imageResp[0].url;
                    }
                }
                await sectionsService.createSection(section.value);
                router.push(`/sections`);

            } catch (e) {
                console.log(e);
            } finally {
                isLoading.value = false;
            }
        };

        // Section Filters_____________
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

        // Remove field_________________
        const isFieldAlertVisible = ref(false);
        const setFieldAlertVisible = (bool) => {
            isFieldAlertVisible.value = bool;
        }
        const fieldToRemove = ref(null);
        const setFieldToRemove = (field) => {
            fieldToRemove.value = field;
            setFieldAlertVisible(true);
        }
        const removeField = (item) => {
            section.value.fields = [...sortedFields.value.filter((field) => field.id !== item.id)];
        };

        const isMobFiltersShow = ref(false);
        const setMobFiltersShow = (bool) => {
            isMobFiltersShow.value = bool;
        }

        onMounted(async () => {
            try{
                isLoading.value = true;
                allEnums.value = await enumService.getEnums();
                allSections.value = await sectionsService.getSections();
            } catch(e) {
                console.log(e)
            } finally {
                isLoading.value = false;
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
            isMobFiltersShow,
            setMobFiltersShow,
            isLoading,
        };
    },
};
</script>

<style>
.file-uploader__cont > button {
    margin-right: 5px;
}
.mobile-filters-show {
    display:block !important;
}
@media (max-width: 991px) {
    .sSectionAside.section {
        padding-bottom: 20px;
    }
    .sSectionMain {
        padding-top: 20px;
    }
}

</style>
