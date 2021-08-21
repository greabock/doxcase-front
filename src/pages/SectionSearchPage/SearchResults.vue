<template>
    <div class="sSearchResult__items">
        <div
            v-for="snippet in materialsSnippetsArr"
            :key="snippet.id"
            class="search-item">
            <div class="row">
                <div class="col-auto">
                    <div class="search-item__icon-wrap">
                        <img alt='' :src="snippet.image" />
                    </div>
                </div>
                <div class="col">
                    <div class="h5">{{ snippet.title}}</div>
                    <div class="text-dark small">Опубликовано {{ snippet.created_at }}
                        <span class="d-sm-none text-primary">
                            <svg class="icon icon-doc ">
                                <use xlink:href="/img/svg/sprite.svg#doc"></use>
                            </svg>25
                        </span>
                    </div>
                </div>
                <div class="col-auto align-self-center d-none d-sm-block">
                    <div class="text-dark small">Документов {{ snippet.docsValue }}</div>
                </div>
                <div class="col-auto align-self-sm-center">
                    <div
                        @click="closeToggleHandler"
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
                            <div class="row">    >
                                <div class="col-auto text-primary">{{field.name}} </div>
                                <div class="col">{{field.value}}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

<!-- Файлы в выдаче -->
        <div
            v-for="file in filesArr"
            :key="file.file.name"
            class="search-item">
            <div class="row">
                <div class="col-auto">
                    <div class="search-item__icon-wrap">
                        <img alt='' src="/img/avatar-2.png" />
                    </div>
                    <div class="file-extension">
                        {{ file.file.extension }}
                    </div>
                </div>
                <div class="col">
                    <div class="h5">{{ file.file.name }}</div>
                    <div class="text-dark small">Опубликовано {{file.file.created_at}}
                        <span class="d-sm-none text-primary">
                            <svg class="icon icon-doc ">
                                <use xlink:href="/img/svg/sprite.svg#doc"></use>
                            </svg>25
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
                <span v-for="(cont, i) in file.highlights.content"
                    v-html="cont"
                    :key='i'
                >
                </span>
            </div>
        </div>

    </div>
</template>

<script>
import {computed} from 'vue';

export default {
    props: {
        allSections: {
            type: Array,
            default: () => []
        },
        materialsArr: {
            type: Array,
            default: () => []
        },
        filesArr: {
            type: Array,
            default: () => []
        }
    },

    setup(props) {

        console.log(props.filesArr);

        const closeToggleHandler = (e) => {
            (e.target.closest('.search-item').classList
                .toggle('search-item--open'));
        };

        const serializeHighLights = (highlight, currentSection) => {
            const highlightsArr = [];

            for (let key in highlight) {
                if (key === 'name') {
                    highlightsArr.push({
                        name: 'Заголовок',
                        value: highlight.name[0]
                    });
                    continue;
                }
                const field = currentSection.fields.find(field => field.id === key);
                if (field && Object.prototype.hasOwnProperty.call(highlight, key)) {
                    highlightsArr.push({
                        name: field.title,
                        value: (highlight[key])[0]
                    });
                }
            }
            return highlightsArr;
        }
        const serializeFields = (material, currentSection) => {
            const fieldsArr = [];

            for (let key in material ) {

                if (Object.prototype.hasOwnProperty.call(material, key)) {

                    if (key === 'id' || key === 'name') continue
                    const field = currentSection.fields.find(field => field.id === key);
                    if (field && Object.prototype.hasOwnProperty.call(field, key)) {
                        fieldsArr.push({
                            name: field.title,
                            value: (material[key])[0]
                        });
                    }

                }

            }
            return fieldsArr;
        }

        const createMaterialSnippet = (material, allSections) => {
            if (allSections.length) {

                const currentSection = allSections.find(section => section.id === material.section.id);

                return {
                    id: material.material.id,
                   title: material.material.name,
                   image: currentSection.image,
                   docsValue: 'добавить на бэк',
                   created_at : 'добавить дату',
                   highlights: serializeHighLights(material.highlight, currentSection),
                   fields: serializeFields(material.material, currentSection),
                };
            } else return [];
        }

        const materialsSnippetsArr = computed(() => {
            return props.materialsArr.map(material => createMaterialSnippet(material, props.allSections));
         });

        return {
            closeToggleHandler,
            materialsSnippetsArr,
            createMaterialSnippet,
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
.search-item__icon-wrap IMG {
    max-width: 100%;
    height:auto;
}
.highlight-wrapper {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    padding-left: 63px;
    margin: 10px 0 0;
}
.file-extension {
    color: #1d47ce;
    font-size: 14px;
}
</style>