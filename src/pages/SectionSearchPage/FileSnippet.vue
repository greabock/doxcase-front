<template>
    <div class="row">
        <div class="col-auto">
            <div class="search-item__icon-wrap">
                <svg width="16" height="21"
                     viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg"
                     class="icon icon-doc" data-v-bf23ea06="">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4632 5.71452L10.2133 0.71452C10.0796 0.573431 9.8878 0.495133 9.68833 0.500235H2.18845C1.36004 0.500235 0.688477 1.13983 0.688477 1.92881V19.0717C0.688477 19.8607 1.36004 20.5002 2.18845 20.5002H14.1883C15.0167 20.5002 15.6882 19.8607 15.6882 19.0717V6.21452C15.6936 6.02454 15.6114 5.84185 15.4632 5.71452ZM9.68843 2.21451L13.8884 6.21451H9.68843V2.21451ZM2.18834 1.9288V19.0717H14.1881V7.64309H9.68822C8.8598 7.64309 8.18824 7.0035 8.18824 6.21452V1.9288H2.18834Z" fill="#242E6B"></path></svg>
            </div>
            <div class="file-extension">
                {{ file.file.extension }}
            </div>
        </div>
        <div class="col">
            <FileLink :id="file.file.id">
                <div class="h5">
                    {{ file.file.name }}
                </div>
            </FileLink>
            <div class="text-dark small">
                <span>
                    Опубликовано {{formatDate(file.file.created_at)}}
                </span>
                <span class='connected-with-material'>
                    Связано с: <router-link target='_blank' :to="`/sections/${file.section.id}/material/${file.material.id}`">{{file.material.name}}</router-link>
                </span>

            </div>
        </div>
    </div>

    <div
        v-if="file.highlights.name.length"
        class="highlight-wrapper"
    >
                <span
                    v-html="file.highlights.name[0]"
                >
                </span>
    </div>
    <div
        v-if="file.highlights.content.length"
        class="highlight-wrapper"
    >
            <p
                v-for="(cont, i) in file.highlights.content"
                v-html="`<span>... </span>${cont}<span> ...</span>`"
                :key='i'
                v-show="i < 3"
                class='highlight-p'
            >
            </p>
        <div
            class='more-highlights-toggle'
            @click='toggleHighlightsOpen'
            v-if='(file.highlights.content.length > 3) && !isHighlightsOpened'
        >
            Еще совпадений: {{file.highlights.content.length - 3}}
        </div>
        <div
            v-show='isHighlightsOpened'
        >
            <p
                v-for="(cont, i) in file.highlights.content"
                v-html="`<span>... </span>${cont}<span> ...</span>`"
                :key='i'
                v-show="i >= 3"
                class='highlight-p'
            >
            </p>
            <div
                class='more-highlights-toggle'
                @click='toggleHighlightsOpen'
            >
                Скрыть
            </div>
        </div>
    </div>
</template>

<script>
import FileLink  from '@/components/FileLink';
import {ref} from 'vue';
import {formatDate} from '@/utils/helpers';

export default {
    props: {
        file: {
            type: Object,
            default: () => null
        }
    },
    components: {
        FileLink
    },
    setup() {
        const isHighlightsOpened = ref(false);
        const toggleHighlightsOpen = () => {
            isHighlightsOpened.value = !isHighlightsOpened.value;
        }
        return {
            formatDate,
            isHighlightsOpened,
            toggleHighlightsOpen
        }
    }
};
</script>

<style scoped>
.more-highlights-toggle {
    margin-bottom: 5px;
    color: #828282;
    cursor: pointer;
}
.file-extension {
    color: #1d47ce;
    font-size: 14px;
}
.connected-with-material {
    display: inline-block;
    margin-left: 50px;
}
.highlight-p {
    margin-bottom: 5px;
}
</style>