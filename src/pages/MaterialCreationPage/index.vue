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
                            <div :class="['col', {'d-flex align-items-center': field.type == 'Boolean'}]">
                                <div class="input-line__input-wrap form-group">
                                    <component
                                        :class="field.type == 'Wiki' ? 'text-area' : 'input-line__input'"
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
                <FilesContainer v-if="file.isActive" :list="file.value" @update="(x) => updateFiles(file, x)" />
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
import {useRouter, useRoute} from 'vue-router';

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

const fieldCreate = ({type, ofType, props, value = null, field}) => {
    return {
        ...field,
        type,
        ofType,
        props,
        value,
    };
};

const fieldsDictionary = {
    Boolean: ({field, value = false}) => fieldCreate({type: 'Boolean', value: !!value, field}),
    Date: ({value, field}) => {
        return fieldCreate({
            field,
            type: 'Date',
            value,
            props: {
                placeholder: field.description,
            },
        });
    },
    Enum: async ({field, multiple, value, ofType}) => {
        const of = ofType ? field.type.of.of : field.type.of;

        const enums = await enumsService.getEnumsObject(of);
        const options = enums.values.map((x) => ({
            key: x.id,
            name: x.title,
        }));

        return fieldCreate({
            field,
            ofType,
            type: 'Enum',
            value,
            props: {
                options,
                placeholder: field.description,
                multiple,
            },
        });
    },
    Select: ({field, value, multiple, ofType}) => {
        const of = ofType ? field.type.of.of : field.type.of;
        const options = of.map((x) => ({
            key: x,
            name: x,
        }));

        return fieldCreate({
            field,
            type: 'Select',
            ofType,
            value:
                value && ofType
                    ? value.map((x) => ({
                          name: x,
                          key: x,
                      }))
                    : {
                          key: value,
                          name: value,
                      },
            props: {
                options,
                placeholder: field.description,
                multiple,
            },
        });
    },
    String: ({field, value}) =>
        fieldCreate({
            field,
            type: 'String',
            value,
            props: {
                placeholder: field.description,
            },
        }),
    Wiki: ({field, value}) =>
        fieldCreate({
            field,
            type: 'Wiki',
            value,
            props: {
                placeholder: field.description,
            },
        }),
    Text: ({field, value}) =>
        fieldCreate({
            field,
            type: 'Text',
            value,
            props: {
                placeholder: field.description,
            },
        }),
    List: ({value = [], field}) => {
        const ofType = field.type.of.name;
        return fieldsDictionary[ofType]({field, multiple: true, value, ofType});
    },
};

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
        const route = useRoute();
        const {sectionId, materialId} = route.params;
        const breadcrumb = ref([
            {
                link: '/',
                name: 'Главная',
            },
            {
                name: 'Создать новый материал',
            },
        ]);

        const isNew = ref(true);

        const setFields = async (sectionObject, materials) => {
            const isFiles = (f) =>
                f.type.name == 'File' || (f.type.name == 'List' && f.type.of && f.type.of.name == 'File');

            const fileList = sectionObject.fields.filter(isFiles).map((f) => {
                const files = materials && materials[f.id] && materials[f.id].map(x => {
                    const n = x.name.split('.');
                    const t = n.splice(-1);
                    const name = n.length ? n.join() : t.join();
                    return {
                    id: f.id,
                    key: f.id,
                    data: {
                        name,
                        type: x.extension,
                        size: 0,
                    },
                    isEdit: false,
                }})

                return {
                ...f,
                type: 'File',
                value: files ? [...files] : [],
                multi: f.type.of && f.type.of.name == 'File',
                isActive: false,
            }});

            if (fileList.length) {
                fileList[0].isActive = true;
            }

            files.value = fileList


            const fieldList = sectionObject.fields.filter((f) => !isFiles(f));

            const f = [];
            for (const field of fieldList) {
                if (materials) {
                    const data = await fieldsDictionary[field.type.name]({field, value: materials[field.id]});
                    f.push(data);
                } else {
                    const data = await fieldsDictionary[field.type.name]({field});
                    f.push(data);
                }
            }

            fields.value = f;
        };

        const getData = async () => {
            if (sectionId && materialId) {
                isNew.value = false;
                const sectionObject = await sectionsService.getSectionObject(sectionId);
                const material = await materialService.getMaterial(sectionId, materialId);
                breadcrumb.value = [
                    {
                        name: 'Главная',
                        link: '/',
                    },
                    {
                        name: sectionObject.title,
                        link: `/sections/${sectionId}`,
                    },
                    {
                        name: material.name,
                    },
                ];

                setFields(sectionObject, material);
                name.value = material.name;
            } else {
                isNew.value = true;
                const sections = await sectionsService.getSections();

                sectionOptions.value = sections.map((s) => ({
                    key: s.id,
                    name: s.title,
                }));
            }
        };

        getData();

        const selectSection = async (section) => {
            const sectionObject = await sectionsService.getSectionObject(section.key);

            setFields(sectionObject);
        };

        const setActive = (file) => {
            files.value.map((x) => (x.isActive = false));
            file.isActive = true;
        };

        const updateFiles = (file, data) => {
            file.value = data;
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
                        if (field.ofType == 'Enum') {
                            fieldsSubmit[field.id] = field.value.map((x) => ({id: x.key, title: x.name}));
                        } else {
                            fieldsSubmit[field.id] = field.value.map((x) => x.name);
                        }
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
                    const res = await fileService.uplodaFile(bodyFormData);
                    submitFiles[file.id] = res.map((x) => ({id: x.id}));
                }

                submitFiles[file.id] = [...file.value.filter(x => x.id).map(x => ({ id: x.id, name: x.data.name })), ...submitFiles[file.id]]
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
