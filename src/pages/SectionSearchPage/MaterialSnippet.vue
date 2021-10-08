<template>
    <div
        class='search-item'
        :class='{"search-item--open": isOpened}'
    >
        <div class="row">
            <div class="col-auto">
                <div class="search-item__icon-wrap">
                    <img
                        v-if="snippet.image"
                        alt='' :src="snippet.image"
                    />
                </div>
            </div>
            <div class="col">
                <div class="h5">
                    <router-link :to="`/sections/${snippet.sectionId}/material/${snippet.id}`">
                        {{ snippet.title}}
                    </router-link>
                </div>
                <div class="text-dark small">Опубликовано {{ snippet.created_at }}
                </div>
            </div>
            <div
                v-if="snippet.files_count"
                class="col-auto align-self-center d-none d-sm-block">
                <div class="text-dark small">Документов: {{ snippet.files_count }}</div>
            </div>
            <div class="col-auto align-self-sm-center">
                <div
                    @click="toggleIsOpened"
                    class="btn-edit-sm btn-primary">
                    <svg class="icon icon-chevron-down ">
                        <use xlink:href="/img/svg/sprite.svg#chevron-down"></use>
                    </svg>
                </div>
            </div>
        </div>

        <div
            v-for="(highlight, i) in snippet.highlights"
            :key="i"
            class="highlight-wrapper"
        >
            <!--                <span class="highlight-title">{{highlight.name}}</span>-->
            <span
                v-html="highlight.value"
                class="highlight-text"
            >
                </span>

        </div>

        <div class="search-item__dropdown pt-3">
            <div class="row">
                <div
                    v-for="field in snippet.fields"
                    :key="field.name"
                    class="col-lg-6">
                    <div class="search-item__panel">
                        <div class="row">
                            <div class="col-auto text-primary">{{field.name}} </div>
                            <div class="col">{{field.value}}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
export default {
    props: {
        snippet: {
            type: Object
        }
    },
    setup() {
        const isOpened = ref(false);
        const toggleIsOpened = () => {
            isOpened.value = !isOpened.value;
        }
        return {
            isOpened,
            toggleIsOpened
        }
    }
};
</script>

<style scoped>
.search-item--open .search-item__dropdown {
    display: block;
}
.search-item__dropdown {
    display: none;
}
.search-item__icon-wrap {
    width: 50px;
}
.search-item__panel .col-auto {
    width:auto;
}
.highlight-wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
    font-size:14px;
    padding-left: 63px;
    margin: 10px 0 0;
}
</style>