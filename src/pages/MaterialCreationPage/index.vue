<template>
    <!-- <h1>Создание нового материала</h1> -->
    <main class="main-block">
        <div class="container-fluid">
            <VBreadcrumb :list="breadcrumb" />
        </div>
        <!-- start sNewMaterial-->
        <div class="sNewMaterial section" id="sNewMaterial">
            <div class="container-fluid">
                <div class="row pb-2">
                    <div class="col">
                        <h1>Новый материал</h1>
                    </div>
                    <div v-if="isNew" class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Выберите раздел</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VSelect
                                        v-model="sectionValue"
                                        class="input-line__input"
                                        :options="sectionOptions"
                                        placeholder="Раздел"
                                        @select="selectSection"
                                    />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div v-if="sectionValue || !isNew" class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Наименование</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VInput
                                        @blur="handleChange"
                                        v-model="name"
                                        class="input-line__input"
                                        placeholder="Введите текст"
                                        :error="error"
                                    />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div v-for="(field, i) of fields" :key="i" class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">
                                    {{ field.type == 'Boolean' ? 'Чекбокс' : field.title }}
                                </div>
                            </div>
                            <div :class="['col', {'d-flex align-items-center': field.type == 'Boolean'}]">
                                <div class="input-line__input-wrap form-group">
                                    <component
                                        :class="
                                            field.type == 'Wiki' || field.type == 'Text'
                                                ? 'text-area'
                                                : 'input-line__input'
                                        "
                                        :is="components[field.type]"
                                        v-model="field.value"
                                        v-bind="field.props"
                                    >
                                        {{ field.title }}
                                    </component>
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end sNewMaterial-->
        <!-- start sAddDocs-->
        <section class="sAddDocs section" id="sAddDocs">
            <div v-if="files.length" class="container-fluid">
                <h2>Работа с документами</h2>
                <ul class="nav nav-tabs">
                    <li v-for="(file, i) of files" :key="i" class="nav-item">
                        <span :class="['nav-link', {active: file.isActive}]" @click="setActive(file)">
                            {{ file.title }}
                        </span>
                    </li>
                </ul>
            </div>
            <template v-for="(file, i) of files" :key="i">
                <FilesContainer
                    v-if="file.isActive"
                    :list="file.value"
                    :accept="file.accept"
                    @update="(x) => updateFiles(file, x)"
                />
            </template>
            <div class="sAddDocs__footer">
                <div class="container-fluid d-flex">
                    <VButton class="btn-save" @click="submit" :isLoad="isLoad"> Сохранить </VButton>
                    <VButton class="ms-2" outline @click="back"> Отмена </VButton>
                </div>
            </div>
        </section>
        <!-- end sAddDocs-->
    </main>
    <loader v-if="isLoaderShown">

    </loader>

</template>

<script>
import {ref} from 'vue';
import {useRouter, useRoute} from 'vue-router';

import VBreadcrumb from '@/ui/VBreadcrumb';
import VSelect from '@/ui/VSelect';
import VMultiBox from '@/ui/VMultiBox';

import VInput from '@/ui/VInput';
import VCheckbox from '@/ui/VCheckbox';
import VDatePicker from '@/ui/VDatePicker';
import VTextEditor from '@/ui/VTextEditor';
import VText from '@/ui/VText';
import VButton from '@/ui/VButton';
import VButtonFileLoader from '@/ui/VButtonFileLoader';
import Loader from '@/components/Loader';

import ItemEdit from './ItemEdit';
import ItemFile from './ItemFile';
import FilesContainer from './FilesContainer';

import sectionsService from '@/services/sections.service';
import materialService from '@/services/material.service';
import fileService from '@/services/files.service';

import useFields from '@/hooks/useFields';

import {useField} from 'vee-validate';
import * as yup from 'yup';
yup.setLocale({
    mixed: {
        default: 'Поле не валидно.',
        required: 'Поле обязательно для заполнения.',
    },
});

export default {
    components: {
        VText,
        VBreadcrumb,
        VSelect,
        VInput,
        VButton,
        VButtonFileLoader,
        ItemEdit,
        ItemFile,
        FilesContainer,
        Loader,
    },
    setup() {
        const {value: name, errorMessage: error, handleChange} = useField('name', yup.string().required());

        const isLoaderShown = ref(false);
        const sectionOptions = ref([]);
        const sectionValue = ref(null);
        const fields = ref([]);
        const files = ref([]);
        const router = useRouter();
        const route = useRoute();
        const {sectionId, materialId} = route.params;
        const isLoad = ref(false);
        const breadcrumb = ref([
            {
                link: '/',
                name: 'Главная',
            },
            {
                name: 'Создать новый материал',
            },
        ]);

        const back = () => {
            router.go(-1);
        };

        const isNew = ref(true);

        const setFields = async (sectionObject, materials) => {
            isLoaderShown.value = true;
            const isFiles = (f) =>
                f.type.name == 'File' || (f.type.name == 'List' && f.type.of && f.type.of.name == 'File');

            const fileList = sectionObject.fields.filter(isFiles).map((f) => {
                const files =
                    materials &&
                    materials[f.id] &&
                    materials[f.id].map((x) => {
                        const n = x.name.split('.');
                        const t = n.splice(-1);
                        const name = n.length ? n.join() : t.join();
                        return {
                            id: x.id,
                            key: x.id,
                            data: {
                                name,
                                type: x.extension,
                                size: x.size,
                            },
                            accept: f.type.of.extensions.map((x) => `.${x}`),
                            isEdit: false,
                        };
                    });

                return {
                    ...f,
                    type: 'File',
                    value: files ? [...files] : [],
                    multi: f.type.of && f.type.of.name == 'File',
                    accept: f.type.of.extensions.map((x) => `.${x}`),
                    isActive: false,
                };
            });

            if (fileList.length) {
                fileList[0].isActive = true;
            }

            files.value = fileList;

            const fieldList = sectionObject.fields.filter((f) => !isFiles(f));

            const f = await useFields(fieldList, materials, sectionValue.value || sectionId);

            fields.value = f;

            isLoaderShown.value = false;
        };

        const getData = async () => {

            isLoaderShown.value = true;

            if (sectionId && materialId) {
                isNew.value = false;

                let material = null;
                let sectionObject = null;

                try {
                    material = await materialService.getMaterial(sectionId, materialId);
                    sectionObject = await sectionsService.getSectionObject(sectionId);
                } catch(e) {
                    router.push('/')
                }

                breadcrumb.value = [
                    {
                        name: 'Главная',
                        link: '/',
                    },
                    {
                        name: sectionObject.title,
                        link: `/search/${sectionId}`,
                    },
                    {
                        name: material.name,
                    },
                ];

                await setFields(sectionObject, material);
                name.value = material.name;
            } else {
                isNew.value = true;
                const sections = await sectionsService.getSections();

                sectionOptions.value = sections.map((s) => ({
                    key: s.id,
                    name: s.title,
                }));

                if (sectionId) {
                    const sectionObject = await sectionsService.getSectionObject(sectionId);

                    breadcrumb.value = [
                        {
                            name: 'Главная',
                            link: '/',
                        },
                        {
                            name: sectionObject.title,
                            link: `/search/${sectionId}`,
                        },
                        {
                            name: 'Создать новый материал',
                        },
                    ];

                    sectionValue.value = {
                        key: sectionObject.id,
                        name: sectionObject.title,
                    }
                    
                    await setFields(sectionObject);
                }
            }

            isLoaderShown.value = false;
        };

        getData();

        const selectSection = async (section) => {
            if (section) {
                const sectionObject = await sectionsService.getSectionObject(section.key);
    
                await setFields(sectionObject);
                return
            } 

            fields.value = []
            files.value = []

        };

        const setActive = (file) => {
            files.value.map((x) => (x.isActive = false));
            file.isActive = true;
        };

        const updateFiles = (file, data) => {
            file.value = data;
        };

        const submit = async () => {
            const errors = [!!name.value];

             if (!name.value) {
                handleChange('');
            }

            for(const el of fields.value) {
                if (el.validate) {
                    const errors = []
                    const res = await el.validate();
                    errors.push(res.valid);
                }
            }

            const isError = !!errors.filter(x => !x).length

            if(isError) {
                return;
            }

            if (isLoad.value) {
                return;
            }

            isLoad.value = true;

            try {
                const fieldsSubmit = {};
                for (const field of fields.value) {
                    if (field.type == 'List') {
                        if (field.value) {
                            if (field.ofType == 'Enum' || field.ofType == 'Dictionary') {
                                fieldsSubmit[field.id] = field.value.map((x) => ({id: x.key, title: x.name}));
                            } else {
                                fieldsSubmit[field.id] = field.value.map((x) => x.name);
                            }
                        }
                    } else if (field.type == 'Enum' || field.type == 'Dictionary') {
                        if (field.value) {
                            fieldsSubmit[field.id] = {id: field.value.key};
                        }
                    } else if (field.type == 'Select') {
                        if (field.value) {
                            fieldsSubmit[field.id] = field.value.key;
                        }
                    } else if (field.type == 'Boolean') {
                        fieldsSubmit[field.id] = field.value;
                    } else {
                        if (field.value) {
                            fieldsSubmit[field.id] = field.value;
                        }
                    }
                }

                const submitFiles = {};
                for (const file of files.value) {
                    const bodyFormData = new FormData();
                    let isFiles = false;
                    for (const f of file.value) {
                        if (f.file) {
                            isFiles = true;
                            bodyFormData.append('files[]', f.file);
                        }
                    }

                    if (isFiles) {
                        bodyFormData.append('field[id]', file.id);
                        const res = await fileService.uploadFiles(bodyFormData);
                        submitFiles[file.id] = res.map((x) => ({id: x.id}));
                    }

                    if (!isNew.value) {
                        const oldFiles = file.value.filter((x) => x.id).map((x) => ({id: x.id}));
                        submitFiles[file.id] = submitFiles[file.id] ? [...oldFiles, ...submitFiles[file.id]] : oldFiles;
                    }
                }

                const material = {
                    name: name.value,
                    ...fieldsSubmit,
                    ...submitFiles,
                };

                if (isNew.value) {
                    const {id} = await materialService.createMaterial(sectionValue.value.key, material);
                    router.push({
                        name: 'MaterialItemPageRoute',
                        params: {
                            sectionId: sectionValue.value.key,
                            materialId: id,
                        },
                    });
                } else {
                    await materialService.updateMaterial(sectionId, materialId, material);
                    router.push({
                        name: 'MaterialItemPageRoute',
                        params: {
                            sectionId,
                            materialId,
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            } finally {
                isLoad.value = false;
            }
        };

        const components = {
            String: VInput,
            Boolean: VCheckbox,
            Text: VText,
            Enum: VSelect,
            List: VMultiBox,
            Dictionary: VSelect,
            Select: VSelect,
            Date: VDatePicker,
            Wiki: VTextEditor,
        };

        return {
            breadcrumb,
            isNew,
            name,
            components,
            sectionOptions,
            selectSection,
            sectionValue,
            fields,
            files,
            setActive,
            updateFiles,
            submit,
            isLoad,
            back,
            error,
            handleChange,
            isLoaderShown,
        };
    },
};
</script>

<style scoped>
.nav-item {
    cursor: pointer;
}

.text-area {
    max-width: 863px;
    min-height: 152px;
}

.main-block {
    display: flex;
    justify-content: space-between;
    flex-flow: column;
}

.btn-save {
    min-width: 12rem;
}

.sNewMaterial {
    padding-bottom: 0;
}
</style>
