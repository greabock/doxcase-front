<template>
    <div class="sCardDocs" id="sCardDocs">
        <div class="container-fluid">
            <div class="col--main">
                <div class="section-title">
                    <h2>Документы</h2>
                </div>
                <ul class="nav nav-tabs">
                    <li v-for="(file, i) of files" :key="i" class="nav-item">
                        <span :class="['nav-link', {active: file.isActive}]" @click="setActive(file)">
                            {{ file.title }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bg-white py-4">
            <div class="container-fluid">
                <div class="col--main">
                    <template v-for="(file, i) of files" :key="i">
                        <div v-if="file.isActive" class="row">
                            <template v-if="file.value && file.value.length">
                                <div v-for="(el, i) of file.value" :key="i" class="col-4">
                                    <FileLink class="sCardDocs__item" :id="el.id">
                                        <span class="sCardDocs__type">
                                            <FileIcon class="icon icon-doc" />
                                            {{ el.extension }}
                                        </span>
                                        <div class="row w-100">

                                        <span class="sCardDocs__title col-12">
                                            {{ el.name }}
                                        </span>
                                            <span class="sCardDocs__size col d-inline-flex align-items-center">
                                                {{ sizeFormat(el.size) }}
                                            </span>
                                            <span class="sCardDocs__download col">
                                                <DownloadIcon class="icon icon-download" />
                                                Скачать
                                            </span>
                                        </div>
                                    </FileLink>
                                </div>
                            </template>
                             <div v-else class="sCardDocs__empty-text">
                                Пока нет добавленных документов
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DownloadIcon from '@/assets/DownloadIcon';
import FileIcon from '@/assets/FileIcon';
import FileLink  from '@/components/FileLink'

import {sizeFormat} from '@/utils/helpers';

export default {
    components: {
        DownloadIcon,
        FileIcon,
        FileLink,
    },
    props: {
        files: Array,
    },
    setup(props) {
        const setActive = (file) => {
            if(props.files) {
                props.files.map((x) => (x.isActive = false));
                file.isActive = true;
            }
        };

        return {
            sizeFormat,
            setActive
        }
    },
};
</script>

<style scoped>
.nav-item {
    cursor: pointer;
}
</style>