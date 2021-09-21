<template>
    <div
        v-if="!(materialsSnippetsArr.length ||  filesArr.length)"
        class="section pt-5"
    >
        <div class="sSections__center-empty">
            <div class="sSections__title-empty h1">Ничего не найдено
            </div>
            <p>Уточните ваш запрос</p>
        </div>
    </div>

    <div class="sSearchResult__items">
        <div
            v-for="snippet in materialsSnippetsArr"
            :key="snippet.id"
            class="search-item">
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
                        <span class="d-sm-none text-primary">
                            <svg class="icon icon-doc ">
                                <use xlink:href="/img/svg/sprite.svg#doc"></use>
                            </svg>25
                        </span>
                    </div>
                </div>
                <div
                    v-if="snippet.files_count"
                    class="col-auto align-self-center d-none d-sm-block">
                    <div class="text-dark small">Документов: {{ snippet.files_count }}</div>
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
                            <div class="row">
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
            v-for="(file, i) in filesArr"
            :key="file.file.name + i"
            class="search-item">
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
                    <FileLink :href="file.file.id" target="_blank">
                        <div class="h5">{{ file.file.name }}</div>
                    </FileLink>
                    <div class="text-dark small">Опубликовано {{formatDate(file.file.created_at)}}
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
import fileService from '@/services/file.service';
import {API_URL} from '@/globals';
import FileLink  from '@/components/FileLink'

export default {
    components: {
        FileLink,
    },
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
                    if (key === 'id' || key === 'name' || key === 'created_at' || key === 'files_count') continue
                    const field = currentSection.fields.find(field => field.id === key);
                    if (field) {
                        if (field.type.of?.name === 'File') continue;
                        let value;

                        if (field.type.name === 'Date') {
                            value = formatDate(material[key]);
                        } else if (field.type.name === 'Boolean') {
                            value = material[key]? 'Да' : 'Нет';
                        } else {
                            value = material[key];
                        }
                        if (!value || value.toString().toLowerCase() === 'null') {
                            value = ' ';
                        }
                        fieldsArr.push({
                            name: field.title,
                            value
                        });
                    }
                }

            }
            return fieldsArr;
        }
        const formatDate = (dateString) => {

            const date = new Date( Date.parse(dateString));

            const day = date.getDate();
            const month = date.getMonth() - (-1);
            const year = date.getFullYear();

            const myDay = (day > 9) ? day : '0' + day;
            const myMonth = (month > 9) ? month : '0' + month;

            return `${myDay}.${myMonth}.${year}`;
        }

        const createMaterialSnippet = (material, allSections) => {
            if (allSections.length) {

                const currentSection = allSections.find(section => section.id === material.section.id);

                return {
                   id: material.material.id,
                   title: material.material.name,
                   image: currentSection.image,
                   sectionId: currentSection.id,
                   files_count: material.material.files_count,
                   created_at :formatDate(material.material.created_at),
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
            formatDate,
            fileService,
            API_URL,
        }
    }

};
</script>

<style>
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
.search-item em {
    background-color: #fff5a7;
}
.search-item__panel .col-auto {
    width:auto;
}
</style>