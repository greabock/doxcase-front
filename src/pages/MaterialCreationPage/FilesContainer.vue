<template>
    <div class="sAddDocs__body bg-white pt-3 pb-4">
        <div class="container-fluid pb-3">
            <VButtonFileLoader :accept="accept" @upload="loadFiles" @reject="reject">
                <div class="btn-add">
                    <div class="topLine__btn topLine__btn--plus btn-primary"></div>
                    <div class="btn-add__text">Добавить документ</div>
                </div>
            </VButtonFileLoader>
        </div>
        <div v-for="(item, i) of listReverse" :key="item.key">
            <ItemEdit
                v-if="item.isEdit"
                :id="item.id"
                :file="item.file"
                :data="item.data"
                @saveFile="(file) => saveFile(item, file)"
                @updateData="(data) => updateData(item, data)"
                @close="item.isEdit = false"
            />
            <ItemFile v-else @edit="editFile(item)" @delete="deleteFile(i)" :data="item.data" />
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
import {computed} from '@vue/runtime-core';

import VButtonFileLoader from '@/ui/VButtonFileLoader';

import ItemEdit from './ItemEdit';
import ItemFile from './ItemFile';

import {notify} from '@kyvg/vue3-notification';

const getFileData = (file) => {
    const {size, name, type} = file;
    const n = name.split('.');
    const t = n.splice(-1);
    const fileName = n.length ? n.join('.') : t.join('.');

    const fileType = t.join('.') || type.split('/').splice(-1).join('/');

    return {
        size,
        name: fileName,
        type: fileType,
    };
};

export default {
    components: {
        VButtonFileLoader,
        ItemEdit,
        ItemFile,
    },
    props: {
        list: Array,
        accept: Array,
    },
    setup(props, {emit}) {
        const listFiles = ref(props.list);

        const saveFile = (item, file) => {
            item.isEdit = false;
            item.file = file;
            item.data = getFileData(file);
            emit('update', listFiles);
        };

        const updateData = (item, data) => {
            item.isEdit = false;
            item.data = {...data};
            emit('update', listFiles);
        };

        const editFile = (item) => {
            listFiles.value.map((item) => (item.isEdit = false));
            item.isEdit = true;
        };

        const deleteFile = (i) => {
            listFiles.value.splice(i, 1);
            emit('update', listFiles);
        };

        const loadFiles = ([file]) => {
            if (file) {
                listFiles.value.map((item) => (item.isEdit = false));
                listFiles.value.push({
                    key: new Date(),
                    isEdit: true,
                    file,
                    data: getFileData(file),
                });

                emit('update', listFiles);
            }
        };

        const listReverse = computed(() => listFiles.value.reverse());

        const reject = () => {
            notify({
                title: 'Ошибка загрузки файла',
                text: `Допустимы файлы с расширением: ${props.accept.join(' ')}`,
                type: 'warn',
            });
        };

        return {
            listReverse,
            listFiles,
            saveFile,
            updateData,
            editFile,
            deleteFile,
            loadFiles,
            reject,
        };
    },
};
</script>
