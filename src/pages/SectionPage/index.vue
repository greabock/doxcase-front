<template>
    <main
        class="main-block"
    >
        <loader
            v-if="isLoading"
        >
        </loader>
        <!-- start sCabinet-->
        <section v-else class="sCabinet section py-0" id="sCabinet">
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
                                    name: 'Редактировать раздел',
                                },
                            ]"
                        />

                        <!-- start sSectionAside-->
                        <div class="sSectionAside section" id="sSectionAside">
                            <div class="pb-1">
                                <h1>Редактировать раздел</h1>
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
                                <div class="uploader-image-wrapper">
                                    <uploader-image
                                        v-model="fileInput"
                                        :preview="section.image"
                                    />
                                    <span
                                        v-if='section.image && !fileInput'
                                        class='text-danger'
                                        @click="removeImagePreview"
                                    >
                                        Удалить
                                    </span>
                                </div>
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
                                    <div class="form-wrap__modal-win-cont">
                                        <button
                                            class="carousel__button is-close"
                                            @click="setMobFiltersShow(false)"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 24 24"
                                                 tabindex="-1">
                                                <path d="M20 20L4 4m16 0L4 20"></path>
                                            </svg>
                                        </button>

                                        <p class="fw-500 mob-filters-title">Фильтры для раздела</p>
                                        <p class="mob-filters-text">Выберите допустимые для фильтрации поля из добавленных</p>

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
                                            <button
                                                @click="resetForm"
                                                class="btn btn-outline-primary"
                                            >Отмена</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="col col--main">
                        <section class="sSectionMain section section-creation-main__wrapper" id="sSectionMain">

                            <div class="section-creation-access__wrapper">
                                <div class="col section-creation-access__header">
                                    Управление общим доступом
                                </div>
                                <div class="col-auto">
                                    <div class="section-creation-access__prefs">
                                        <span class="section-creation-access__avalible">Доступен: </span>
                                        <span class="section-creation-access__avalible-value">{{accessType.name}}</span>
                                        <v-button
                                            @click="isAccessModal = true"
                                            class="btn-xxs"
                                        >Настроить</v-button>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <h3>Конструктор полей для добавления материалов</h3>
                                </div>
                                <div class="col-auto d-none d-lg-block">
                                    <div class="btn-add"
                                         @click.stop="setFieldToChange({}); setFieldModalVisible(true)">
                                        <div class="topLine__btn topLine__btn--plus btn-primary"></div>
                                        <div class="btn-add__text">Добавить
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="sSectionMain__body">

                                <!-- Поле Название раздела -->

                                <fields-list
                                    @change-title="isTitleModal = true"
                                    @change-field="setFieldToChange"
                                    @sort-field-down="sortFieldDown"
                                    @sort-field-up="sortFieldUp"
                                    @remove-field="setFieldToRemove"
                                    :config="section.config"
                                    :fieldsArr="sortedFields"
                                    :allSections="allSections"
                                    :allEnums="allEnums"
                                ></fields-list>
                            </div>

                            <div class="d-lg-none">
                                <div class="mb-3">
                                    <div class="btn-add">
                                        <div class="topLine__btn topLine__btn--plus btn-primary"></div>
                                        <div
                                            @click="setFieldToChange({}); setFieldModalVisible(true)"
                                            class="btn-add__text"
                                        >Добавить</div>
                                    </div>
                                </div>
                                <div class="sSectionAside__footer">
                                    <button
                                        @click="updateSection"
                                        :class="{disabled: section.title === ''}"
                                        class="btn btn-primary"
                                    >
                                        Сохранить раздел
                                    </button>
                                    <button
                                        @click="resetForm"
                                        class="btn btn-outline-primary ms-2"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </section>
                        <!-- end sSectionMain-->
                    </div>
                </div>
            </div>

            <!-- Управление заголовком полей -->
            <modal-window
                v-model="isTitleModal"
                maxWidth="600px"
            >
                <title-field
                    :config="section.config"
                    @updateTitle="updateTitle"
                >
                </title-field>
            </modal-window>

            <new-field-form
                :isFieldModalVisible="isFieldModalVisible"
                @updateFieldModalVisible="setFieldModalVisible"
                @addNewField="addNewField"
                :fieldsArrLength="section.fields.length"
                :fieldToChange="fieldToChange"
                :allEnums="allEnums"
                :allSections="allSections"
            ></new-field-form>

        </section>

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

        <!-- Управление доступом -->
        <modal-window
            v-model="isAccessModal"
            maxWidth="600px"
        >
            <access-control-form
                :section="section"
                @updateAccess="updateAccessHandle"
                :allUsers="allUsers"
                :allGroups="allGroups"
            >
            </access-control-form>
        </modal-window>

    </main>
</template>

<script>
import {ref, computed, onMounted} from 'vue';
import sectionsService from '@/services/sections.service';

import enumService from '@/services/enums.service';
import filesService from '@/services/files.service';
import usersService from '@/services/users.service';
import groupService from '@/services/group.service';

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
import AccessControlForm from '@/pages/SectionCreationPage/AccessControlForm';
import {defineAccessType} from '@/utils/section.helpers';
import TitleField from '@/pages/SectionCreationPage/FieldTypes/TitleField';

export default {
    components: {
        FieldsToFilter,
        NewFieldForm,
        FieldsList,
        UploaderImage,
        VBreadcrumb,
        VButton,
        ModalWindow,
        Loader,
        AccessControlForm,
        TitleField
    },
    setup() {
        const isLoading = ref(true);
        let initSection = null;
        const allSections = ref([]);
        const allEnums = ref([]);
        const allUsers = ref([]);
        const allGroups = ref([]);

        const router = useRouter();

        const section = ref({});
        const sortedFields = computed(() => {
            if (section.value.fields) {
                return [...section.value.fields].sort((a, b) => a.sort_index - b.sort_index);
            } return []
        });

        // Input File_____________________
        const fileInput = ref(null);
        const resetForm = () => {
            router.push('/sections');
        };
        const removeImagePreview = () => {
            section.value = {...section.value, image: null} ;
        }

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

// Управление доступом__________________
        const isAccessModal = ref(false);
        const accessType = computed(() => {
            return defineAccessType(section.value.access);
        });

        const updateGroupsNUsers = ({access, users, groups}) => {
            switch (access) {
                case 'all':
                    section.value = {
                        ...section.value,
                        access,
                        groups: [],
                        users: []
                    }
                    return;
                case 'only':
                    section.value = {
                        ...section.value,
                        access,
                        groups,
                        users
                    }
                    return;
                case 'except':
                    section.value = {
                        ...section.value,
                        access,
                        groups,
                        users
                    }
                    return;
            }
        }
        const updateAccessHandle = (accessObj) => {
            updateGroupsNUsers(accessObj);
            isAccessModal.value = false;
        }
// Заголовок поля___________________
        const isTitleModal = ref(false);
        const updateTitle = (newConfig) => {
            section.value.config = newConfig;
            isTitleModal.value = false;
        }
//Добавление поля___________________
        const addNewField = (newField) => {
            const itemToUpdate = section.value.fields?.find((item) => item.id === newField.id);
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
                isLoading.value = true;
                if (fileInput.value) {
                    const formData = new FormData();
                    formData.append('files[]', fileInput.value)

                    const imageResp =  await filesService.uploadFiles(formData);
                    if (imageResp) {
                        section.value = {...section.value, image: imageResp[0].url};
                    }
                }
                await sectionsService.updateSection(section.value);
                router.push(`/sections`);
            } catch (e) {
                console.log(e);
            } finally {
                isLoading.value = false;
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

        const isMobFiltersShow = ref(false);
        const setMobFiltersShow = (bool) => {
            isMobFiltersShow.value = bool;
        }

        onMounted(async () => {
            try{
                initSection = await sectionsService.getSectionObject(router.currentRoute.value.params.id);
                section.value = initSection;
                allEnums.value = await enumService.getEnums();
                allSections.value = await sectionsService.getSections();
                allUsers.value = await usersService.getUsers();
                allGroups.value = await groupService.getAllGroups();

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
            updateSection,
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
            isLoading,
            isMobFiltersShow,
            setMobFiltersShow,
            updateAccessHandle,
            accessType,
            isAccessModal,
            allUsers,
            allGroups,
            isTitleModal,
            updateTitle,
            removeImagePreview,
        };
    },
};
</script>

<style>
.file-uploader__cont > button {
    margin-right: 5px;
}
.content-loader__wrapper {
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
.content-loader__cont {
    font-size: 26px;
    color: #1d47ce;
}
.mobile-filters-show {
    display:block !important;
}
.mob-filters-text {
    display: none;
}
.form-wrap__modal-win-cont .carousel__button{
  display: none;
}
@media (max-width: 991px) {
    .sSectionAside.section {
        padding-bottom: 20px;
    }
    .sSectionMain {
        padding-top: 20px;
    }
    .mobile-filters-show {
        position: fixed;
        z-index: 100;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0, .5);
    }
    .form-wrap__modal-win-cont {
        position: absolute;
        top: 20px;
        bottom: 20px;
        left: 20px;
        right: 20px;
        padding: 40px 20px 20px;
        background-color: #fff;
    }
  .form-wrap__modal-win-cont .carousel__button{
    display: block;
  }
    .mob-filters-title {
        font-size:20px;
    }
    .mob-filters-text {
        display: block;
    }
}
.carousel__button svg {
    filter:none;
}
.uploader-image-wrapper {
    display: flex;
    align-items: center;
}
.uploader-image-wrapper > SPAN {
    display: block;
    margin-bottom: 1rem;
    cursor: pointer;
    margin-left: 24px;
}
</style>
