<template>
    <div class='search-results-wrapper'>
        <loader
            v-if='isMatFilesUpdating'
            :bgColor="'#f7f7f7'"
            :loaderType="'absolute'"
        >
        </loader>

        <div
            v-if="!(materialsSnippetsArr.length || filesArr.length)"
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
            >
                <material-snippet :snippet="snippet">
                </material-snippet>
            </div>

            <div
                v-for="(file, i) in filesArr"
                :key="file.file.name + i"
                class="search-item"
            >
                <file-snippet :file="file">
                </file-snippet>
            </div>

        </div>
    </div>
</template>

<script>
import {computed} from 'vue';
import {formatDate} from '@/utils/helpers';
import FileSnippet from '@/pages/SectionSearchPage/FileSnippet';
import Loader from '@/components/Loader';
import MaterialSnippet from '@/pages/SectionSearchPage/MaterialSnippet';

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
        },
        isLoading: {
            type: Boolean,
        },
        isSelectsLoading: {
            type: Boolean,
        },
        isMatFilesUpdating: {
            type: Boolean,
        }
    },
    components: {
        FileSnippet,
        MaterialSnippet,
        Loader
    },
    setup(props) {

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
            materialsSnippetsArr,
            createMaterialSnippet,
            formatDate,
        }
    }

};
</script>

<style>
.search-results-wrapper {
    position: relative;
}

.search-item__icon-wrap IMG {
    max-width: 100%;
    height:auto;
}

.highlight-wrapper > span {
    margin-bottom: 5px;
}

.search-item em {
    background-color: #fff5a7;
}
</style>