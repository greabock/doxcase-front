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
                                        <button
                                            v-if="canUpdate"
                                            @click="edit"
                                            class="sCardHead__aside-btn btn-primary"
                                            type="button"
                                        >
                                            Редактировать материал
                                        </button>
                                    </div>
                                    <div class="col-auto">
                                        <button
                                            @click="isMobAside = true"
                                            class="sCardHead__toggle-aside sCardHead__toggle-aside--js"
                                            type="button"
                                        >
                                            !
                                        </button>
                                    </div>
                                    </div>
                                <div class='row'>
                                    <div class="col">
                                        <button
                                            v-if="canUpdate"
                                            class="sCardHead__aside-btn btn-outline-primary"
                                            type="button"
                                            @click="isShow = true"
                                        >
                                            Удалить материал
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="sCardHead__head">
                                <div class="row">
                                    <template v-for="(block, i) of topBlocks" :key="i">
                                        <div v-if="block.isActive" class="col-sm-6">
                                            <div class="sCardHead__head-panel">
                                                <div class="row">
                                                    <div class="col text-dark small">{{ block.title }}</div>
                                                    <div class="col-auto fw-500">{{ block.value }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="sCardHead__body">
                                <template v-for="(field, i) of fields" :key="i">
                                    <template v-if="field.value">
                                        <h6>{{ field.title }}</h6>
                                        <p v-if="field.type !== 'Wiki'">{{ field.value }}</p>
                                        <div class="html-data" v-else v-html="field.value" />
                                        <br />
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div
                        id="mob-aside-wrapper"
                        class="col-aside col-lg-auto d-flex flex-column"
                    >
                        <div
                            :class="{'active': isMobAside}"
                            class="sCardHead__aside"
                        >
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
                            <ListContainer :lists="lists" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end sCardHead-->
        <!-- start sCardDocs-->
        <FilesContainer v-if="files && files.length" :files="files" />
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
import {computed, ref, onMounted, onUnmounted} from 'vue';
import {useStore} from 'vuex';
import {useRoute, useRouter} from 'vue-router';
import {format} from 'date-fns';
import materialService from '@/services/material.service';
import sectionsService from '@/services/sections.service';

import ModalWindow from '@/components/ModalWindow';
import VBreadcrumb from '@/ui/VBreadcrumb';
import FilesContainer from './FilesContainer';
import ListContainer from './ListContainer';

export default {
    components: {
        VBreadcrumb,
        ModalWindow,
        FilesContainer,
        ListContainer,
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
            const user = store.getters['user/getUser'];
            return user?.role === 'admin' || user?.role === 'moderator';
        });

        const getData = async (sectionId, materialId) => {
            const section = await sectionsService.getSectionObject(sectionId);
            const material = await materialService.getMaterial(sectionId, materialId);

            breadcrumbs.value = [
                {
                    link: '/',
                    name: 'Главная',
                },
                {
                    name: section.title,
                    link: `/search/${sectionId}`,
                },
                {
                    name: material.name,
                },
            ];

            title.value = material.name;

            const isFiles = (f) =>
                f.type.name == 'File' || (f.type.name == 'List' && f.type.of && f.type.of.name == 'File');

            const idDictionary = (f) =>
                f.type.name == 'Dictionary' || (f.type.name == 'List' && f.type.of && f.type.of.name == 'Dictionary');

            const allFields = section.fields.filter((f) => !isFiles(f)).sort((a, b) => a.sort_index - b.sort_index);

            fields.value = [
                ...fields.value,
                ...allFields
                    .filter((x) => x.type.name == 'Text' || x.type.name == 'Wiki' || x.type.name == 'String')
                    .map((x) => ({
                        ...x,
                        value: material[x.id],
                        type: x.type.name,
                    })),
            ];

            lists.value = [
                ...lists.value,
                ...allFields
                    .filter(
                        (x) =>
                            x.type.name == 'List' ||
                            x.type.name == 'Select' ||
                            x.type.name == 'Enum' ||
                            x.type.name == 'Dictionary'
                    )
                    .map((d) => {
                        if (idDictionary(d)) {
                            const sectionId = d.type.name == 'List' ? d.type.of.of : d.type.of;
                            const materials = d.type.name == 'List' ? material[d.id] : [material[d.id]];
                            return {
                                title: d.title,
                                value: materials.map((x) => ({
                                    title: x.name,
                                    link: `/sections/${sectionId}/material/${x.id}`,
                                })),
                                type: d.type.name,
                                ofType: d.type.of.name,
                            };
                        }

                        return {
                            ...d,
                            value: material[d.id]
                                ? Array.isArray(material[d.id])
                                    ? material[d.id]
                                    : [material[d.id]]
                                : [],
                            type: d.type.name,
                            ofType: d.type.of.name,
                        };
                    }),
            ];

            topBlocks.value = [
                ...topBlocks.value,
                ...allFields
                    .filter((x) => x.type.name == 'Date' || x.type.name == 'Boolean')
                    .map((x) => {
                        if (x.type.name == 'Boolean') {
                            return {
                                ...x,
                                value: material[x.id] ? 'Да' : 'Нет',
                                title: x.title,
                                type: x.type.name,
                                isActive: true,
                            };
                        } else {
                            return {
                                ...x,
                                value: material[x.id] && format(new Date(material[x.id]), 'dd.MM.yyyy'),
                                title: x.title,
                                type: x.type.name,
                                isActive: !!material[x.id],
                            };
                        }
                    }),
            ];

            files.value = [
                ...files.value,
                ...section.fields.filter(isFiles).map((f) => ({
                    type: 'File',
                    title: f.title,
                    isActive: false,
                    size: f.size,
                    value: material[f.id],
                })),
            ];

            if (files.value && files.value[0]) {
                files.value[0].isActive = true;
            }
        };

        getData(sectionId, materialId);

        const deleteMaterial = async () => {
            await materialService.removeMaterial(sectionId, materialId);
            router.go(-1);
        };

        const edit = () => {
            router.push(`/material-edit/${sectionId}/${materialId}`);
        };

        const isMobAside = ref(false);
        const hideMobAside = (e) => {
            const mobAside = document.querySelector('#mob-aside-wrapper');
            const toggleButton = document.querySelector('.sCardHead__toggle-aside');

            console.log(mobAside.contains(e.target), toggleButton.contains(e.target));
            if(!mobAside.contains(e.target) && !toggleButton.contains(e.target)) {
                isMobAside.value = false;
            }
        }

        onMounted(() => {
            window.addEventListener('click', hideMobAside);
        })

        onUnmounted(() => {
            window.removeEventListener('click', hideMobAside);
        })

        return {
            edit,
            isShow,
            breadcrumbs,
            deleteMaterial,
            title,
            fields,
            lists,
            files,
            topBlocks,
            canUpdate,
            isMobAside,
        };
    },
};
</script>

<style scoped>
.main-block {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
}

.btn-primary {
    color: #fff;
}

.html-data >>> * {
    max-width: 100%;
}
</style>
