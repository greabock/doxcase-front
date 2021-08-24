<template>
    <!-- <h1>Info for material id: {{ $route.params.id }}</h1> -->
    <main class="main-block">
        <!-- start sCardHead-->
        <div class="sCardHead section" id="sCardHead">
            <div class="container-fluid">
                <div class="row">
                    <div class="col col--main">
                        <VBreadcrumb :list="breadcrumbs" />
                        <h1>{{ title }}</h1>
                        <div class="sCardHead__content">
                            <div class="d-lg-none pt-1">
                                <div class="row">
                                    <div class="col">
                                        <button class="sCardHead__aside-btn btn-outline-primary" type="button">
                                            Редактировать материал
                                        </button>
                                    </div>
                                    <div class="col-auto">
                                        <button
                                            class="sCardHead__toggle-aside sCardHead__toggle-aside--js"
                                            type="button"
                                        >
                                            !
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="sCardHead__head">
                                <div class="row">
                                    <div v-for="(block, i) of topBlocks" :key="i" class="col-sm-6">
                                        <div class="sCardHead__head-panel">
                                            <div class="row">
                                                <div class="col text-dark small">{{ block.title }}</div>
                                                <div class="col-auto fw-500">{{ block.value }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="sCardHead__body">
                                <template v-for="(field, i) of fields" :key="i">
                                    <template v-if="field.value">
                                        <h6>{{ field.title }}</h6>
                                        <p v-if="field.type !== 'Wiki'">{{ field.value }}</p>
                                        <p v-else v-html="field.value" />
                                        <br />
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="col-aside col-lg-auto d-flex flex-column">
                        <div class="sCardHead__aside">
                            <button
                                v-if="canUpdate"
                                class="sCardHead__aside-btn btn-primary"
                                type="button"
                                @click="edit"
                            >
                                Редактировать материал
                            </button>
                            <button
                                v-if="canUpdate"
                                class="sCardHead__aside-btn btn-outline-primary"
                                type="button"
                                @click="isShow = true"
                            >
                                Удалить материал
                            </button>
                            <ul>
                                <li v-for="(el, i) of lists" :key="i">
                                    <template v-if="el.value && el.value.length">
                                        <div class="strong">{{ el.title }}</div>
                                        <ul v-if="el.value">
                                            <li v-for="(v, x) of el.value" :key="x">
                                                {{ el.type == 'List' ? (el.ofType == 'Enum' ? v.title : v) : el.type == 'Enum' ? v.title : v }}
                                            </li>
                                        </ul>
                                    </template>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end sCardHead-->
        <!-- start sCardDocs-->
        <FilesContainer v-if="files.length" :files="files" />
        <!-- end sCardDocs-->
        <ModalWindow v-model="isShow" maxWidth="24rem">
            <div class="form-wrap">
                <div class="h3 mb-4">Удаление</div>
                <p>Вы уверены что хотите удалить материал? Данное действие необратимое!</p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-primary btn-cancel" @click="deleteMaterial">Удалить</button>
                    <button class="btn btn-outline-primary btn-cancel" @click="isShow = false">Закрыть</button>
                </div>
            </div>
        </ModalWindow>
    </main>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import {useRoute, useRouter} from 'vue-router';
import {format} from 'date-fns';
import materialService from '@/services/material.service';
import sectionsService from '@/services/sections.service';

import ModalWindow from '@/components/ModalWindow';
import VBreadcrumb from '@/ui/VBreadcrumb';
import FilesContainer from './FilesContainer';

export default {
    components: {
        VBreadcrumb,
        ModalWindow,
        FilesContainer,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const {sectionId, materialId} = route.params;
        const title = ref('');
        const fields = ref([]);
        const lists = ref([]);
        const files = ref([]);
        const topBlocks = ref([]);
        const isShow = ref(false);
        const breadcrumbs = ref([
            {
                link: '/',
                name: 'Главная',
            },
        ]);

        const store = useStore();
        const canUpdate = computed(() => {
            const user = store.getters['user/getUser']
            return user?.role === 'admin' || user?.role === 'moderator';
        });

        const getData = async () => {
            const section = await sectionsService.getSectionObject(sectionId);
            const material = await materialService.getMaterial(sectionId, materialId);

            breadcrumbs.value = [
                ...breadcrumbs.value,
                {
                    name: section.title,
                    link: `/sections/${sectionId}`,
                },
                {
                    name: material.name,
                },
            ];

            const isFiles = (f) =>
                f.type.name == 'File' || (f.type.name == 'List' && f.type.of && f.type.of.name == 'File');

            const allFields = section.fields.filter((f) => !isFiles(f)).sort((a, b) => a.sort_index - b.sort_index);

            fields.value = allFields
                .filter((x) => x.type.name == 'Text' || x.type.name == 'Wiki' || x.type.name == 'String')
                .map((x) => ({
                    ...x,
                    value: material[x.id],
                    type: x.type.name,
                }));

            lists.value = allFields
                .filter(
                    (x) =>
                        x.type.name == 'List' ||
                        x.type.name == 'Select' ||
                        x.type.name == 'Dictionary' ||
                        x.type.name == 'Enum'
                )
                .map((x) => ({
                    ...x,
                    value: material[x.id] ? (Array.isArray(material[x.id]) ? material[x.id] : [material[x.id]]) : [],
                    type: x.type.name,
                    ofType: x.type.of.name,
                }));

            topBlocks.value = allFields
                .filter((x) => x.type.name == 'Date' || x.type.name == 'Boolean')
                .map((x) => {
                    if (x.type.name == 'Boolean') {
                        return {
                            ...x,
                            value: material[x.id] ? 'Да' : 'Нет',
                            title: x.title,
                        };
                    } else {
                        return {
                            ...x,
                            value: format(new Date(material[x.id]), 'dd.MM.yyyy'),
                            title: x.title,
                        };
                    }
                });

            files.value = section.fields.filter(isFiles).map((f, i) => ({
                type: 'File',
                title: f.title,
                isActive: !i,
                size: f.size,
                value: material[f.id],
            }));

            title.value = material.name;
        };

        getData();

        const setActive = (file) => {
            files.value.map((x) => (x.isActive = false));
            file.isActive = true;
        };

        const deleteMaterial = async () => {
            await materialService.removeMaterial(sectionId, materialId);
            router.push('/');
        };

        const edit = () => {
            router.push(`/material-edit/${sectionId}/${materialId}`);
        };

        return {
            edit,
            isShow,
            breadcrumbs,
            deleteMaterial,
            setActive,
            title,
            fields,
            lists,
            files,
            topBlocks,
            canUpdate,
        };
    },
};
</script>

<style scoped>
.nav-item {
    cursor: pointer;
}

.main-block {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
}

.btn-primary {
    color: #fff;
}
</style>
