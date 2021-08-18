<template>
    <!-- <h1>Создание нового материала</h1> -->
    <main class="main-block">
        <div class="container-fluid">
            <VBreadcrumb
                :list="[
                    {
                        link: '/',
                        name: 'Главная',
                    },
                    {
                        name: 'Создать новый материал',
                    },
                ]"
            />
        </div>
        <!-- start sNewMaterial-->
        <div class="sNewMaterial section" id="sNewMaterial">
            <div class="container-fluid">
                <div class="row pb-2">
                    <div class="col">
                        <h1>Новый материал</h1>
                    </div>
                    <div class="input-line">
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
                    <div v-if="sectionValue" class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Название материала</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VInput v-model="name" class="input-line__input" placeholder="Введите" />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div v-for="(field, i) of fields" :key="i" class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">{{ field.title }}</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <component
                                        :is="components[field.type]"
                                        :class="field.type == 'Wiki' ? 'text-area' : 'input-line__input'"
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
                <FilesContainer v-if="file.isActive" :list="file.files" @update="(x) => updateFiles(file, x)" />
            </template>
            <div class="sAddDocs__footer">
                <div class="container-fluid d-flex">
                    <VButton class="w-auto" @click="submit"> Сохранить изменения </VButton>
                    <VButton class="ms-2" outline> Отмена </VButton>
                </div>
            </div>
        </section>
        <!-- end sAddDocs-->
    </main>
</template>

<script>
import {ref} from 'vue';
// import {v4 as uuidv4} from 'uuid';

import VBreadcrumb from '@/ui/VBreadcrumb';
import VSelect from '@/ui/VSelect';
import VInput from '@/ui/VInput';
import VCheckbox from '@/ui/VCheckbox';
import VDatePicker from '@/ui/VDatePicker';
import VTextEditor from '@/ui/VTextEditor';
import VText from '@/ui/VText';
import VButton from '@/ui/VButton';
import VButtonFileLoader from '@/ui/VButtonFileLoader';

import ItemEdit from './ItemEdit';
import ItemFile from './ItemFile';
import FilesContainer from './FilesContainer';

import sectionsService from '@/services/sections.service';
import enumsService from '@/services/enums.service';
import materialService from '@/services/material.service';
import fileService from '@/services/file.service';

import {useRouter} from 'vue-router';

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
    },
    setup() {
        const sectionOptions = ref([]);
        const sectionValue = ref(null);
        const fields = ref([]);
        const files = ref([]);
        const name = ref('');
        const router = useRouter();

        const getSections = async () => {
            const sections = await sectionsService.getSections();

            sectionOptions.value = sections.map((s) => ({
                key: s.id,
                name: s.title,
            }));
        };

        getSections();

        const selectSection = async (section) => {
            const sectionObject = await sectionsService.getSectionObject(section.key);

            const isFiles = (f) =>
                f.type.name == 'File' || (f.type.name == 'List' && f.type.of && f.type.of.name == 'File');

            files.value = sectionObject.fields.filter(isFiles).map((f) => ({
                ...f,
                type: 'File',
                files: [],
                multi: f.type.of && f.type.of.name == 'File',
                isActive: false,
            }));

            if (files.value.length) {
                files.value[0].isActive = true;
            }

            const fieldList = sectionObject.fields.filter((f) => !isFiles(f));
            const f = [];
            for (let field of fieldList) {
                if (field.type.name == 'Boolean') {
                    f.push({
                        ...field,
                        type: field.type.name,
                        value: false,
                    });
                } else if (field.type.name == 'Enum') {
                    const enums = await enumsService.getEnumsObject(field.type.of);
                    f.push({
                        ...field,
                        type: field.type.name,
                        value: null,
                        props: {
                            options: enums.values.map((x) => ({
                                key: x.id,
                                name: x.title,
                            })),
                            placeholder: field.description,
                        },
                    });
                } else if (field.type.name == 'Select') {
                    f.push({
                        ...field,
                        type: field.type.name,
                        value: null,
                        props: {
                            options:
                                field.type.of &&
                                field.type.of.map((x) => ({
                                    key: x,
                                    name: x,
                                })),
                            placeholder: field.description,
                        },
                    });
                } else if (field.type.name == 'List') {
                    if (field.type.of && field.type.of.name == 'Enum') {
                        const enums = await enumsService.getEnumsObject(field.type.of.of);
                        f.push({
                            ...field,
                            type: field.type.name,
                            ofType: field.type.of.name,
                            value: null,
                            props: {
                                options: enums.values.map((x) => ({
                                    key: x.id,
                                    name: x.title,
                                })),
                                placeholder: field.description,
                                multiple: field.type.name == 'List',
                            },
                        });
                    } else if (field.type.of && field.type.of.name == 'Select') {
                        f.push({
                            ...field,
                            type: field.type.name,
                            value: null,
                            props: {
                                options:
                                    field.type.of.of &&
                                    field.type.of.of.map((x) => ({
                                        key: x,
                                        name: x,
                                    })),
                                placeholder: field.description,
                                multiple: true,
                            },
                        });
                    }
                } else {
                    f.push({
                        id: field.id,
                        title: field.title,
                        type: field.type.name,
                        value: null,
                        props: {
                            placeholder: field.description,
                        },
                    });
                }
            }

            fields.value = f;
        };

        const setActive = (file) => {
            files.value.map((x) => (x.isActive = false));
            file.isActive = true;
        };

        const updateFiles = (file, data) => {
            file.files = data;
        };

        const submit = async () => {
            const fieldsSubmit = {};
            for (const field of fields.value) {
                if (field.type == 'Enum' || field.type == 'Select') {
                    if (field.value) {
                        fieldsSubmit[field.id] = field.value.key;
                    }
                } else if (field.type == 'List') {
                    if (field.value) {
                        fieldsSubmit[field.id] = field.value.map((x) => x.name);

                    }
                } else if (field.type == 'Boolean') {
                    // fieldsSubmit[field.id] = field.value;
                } else {
                    if (field.value) {
                        fieldsSubmit[field.id] = field.value;
                    }
                }
            }

            console.log('fields', fieldsSubmit);

            const submitFiles = {};
            for (const file of files.value) {
                const bodyFormData = new FormData();
                let isFiles = false;
                for (const f of file.files) {
                    if (f.file) {
                        isFiles = true;
                        bodyFormData.append('files[]', f.file);
                    }
                }

                if (isFiles) {
                    const res = await fileService.uplodaFile(bodyFormData);
                    submitFiles[file.id] = res.map((x) => ({id: x.id}));
                }
            }

            const material = {
                // id: uuidv4(),
                name: name.value,
                ...fieldsSubmit,
                ...submitFiles,
            };

            const {id} = await materialService.createMaterial(sectionValue.value.key, material);
            router.push({
                name: 'MaterialItemPageRoute',
                params: {
                    sectionId: sectionValue.value.key,
                    materialId: id,
                },
            });
        };

        const components = {
            String: VInput,
            Boolean: VCheckbox,
            Text: VText,
            Enum: VSelect,
            List: VSelect,
            Select: VSelect,
            Date: VDatePicker,
            Wiki: VTextEditor,
        };
        return {
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
</style>
