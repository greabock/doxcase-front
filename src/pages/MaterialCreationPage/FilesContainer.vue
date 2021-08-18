<template>
    <div class="sAddDocs__body bg-white pt-3">
        <div class="container-fluid pb-3">
            <VButtonFileLoader @upload="loadFiles">
                <div class="btn-add">
                    <div class="btn-add__plus"></div>
                    <div class="btn-add__text">Добавить документ</div>
                </div>
            </VButtonFileLoader>
        </div>
        <div v-for="(item, i) of listReverse" :key="item.key">
            <ItemEdit
                v-if="item.isEdit"
                :file="item.file"
                :data="item.data"
                @save="(file) => saveFile(item, file)"
                @close="item.isEdit = false"
            />
            <ItemFile
                v-else
                @edit="editFile(item)"
                @delete="deleteFile(i)"
                :file="item.file"
                :data="item.data"
            />
        </div>
    </div>
</template>


<script>
import {ref} from 'vue';
import {computed} from '@vue/runtime-core';


import VButtonFileLoader from '@/ui/VButtonFileLoader';

import ItemEdit from './ItemEdit';
import ItemFile from './ItemFile';

const getFileData = (file) => {
    const {size, name, type} = file;
    const kb = size / 1024;
    const mb = kb / 1024;

    const n = name.split('.');
    const t = n.splice(-1);
    const fileName = n.length ? n.join() : t.join();

    const fileType = type.split('/').splice(-1).join();

    return {
        size: mb > 0 ? `${kb.toFixed(2)} kb` : `${mb.toFixed(2)} mb`,
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
    props:{
        list: Array,
    },
    setup(props, { emit }) {
        const listFiles = ref(props.list);

        const saveFile = (item, file) => {
            item.isEdit = false;
            item.file = file;
            item.data = getFileData(file);
            emit('update', listFiles)
        };

        const editFile = (item) => {
            listFiles.value.map((item) => (item.isEdit = false));
            item.isEdit = true;
        };

        const deleteFile = (i) => {
            listFiles.value.splice(i, 1);
            emit('update', listFiles)
        };

        const loadFiles = ([file]) => {
            listFiles.value.map((item) => (item.isEdit = false));
            listFiles.value.push({
                key: new Date(),
                isEdit: true,
                file,
                data: getFileData(file),
            });

            emit('update', listFiles)
        };

        const listReverse = computed(() => listFiles.value.reverse());

        return {
            listReverse,
            listFiles,
            saveFile,
            editFile,
            deleteFile,
            loadFiles,
        };
    },
};
</script>
