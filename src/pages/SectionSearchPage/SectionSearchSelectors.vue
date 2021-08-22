<template>
    <div class="customs-select">
        <div class="row">
            <div
                v-for="item of selectorOptionsArr"
                :key="item?.id"
                class="col-auto">
                <div class="customs-select__input-wrap form-group">
                    <label>
                        <span class="customs-select__input-title">{{item?.title}}</span>
                        <select
                            :multiple='item.multi'
                            @change="(event) => $emit('updateSelector', { name: item.id, value: event.target.value, multi: item.multi})"
                            class="customs-select__input form-select custom-select"
                        >
                            <option value="Выберите" disabled selected>Выберите</option>
                            <option
                                v-for="option in item?.options"
                                :value="option?.value"
                                :key="option?.name"
                            >{{option?.title}}
                            </option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import {ref, computed, watch} from 'vue';
import enumsService from '@/services/enums.service';
import sectionsService from '@/services/sections.service';

export default {
    props: {
        fieldsArray: {
            type: Array,
            default: () => []
        },
        allSections: {
            type: Array,
            default: () => []
        }
    },
    emits: ['updateSelector'],

    setup(props) {
        const selectorOptionsArr = ref([]);

        const filteredFields = computed(() => {
            let fieldsToSelectors;
            if (props.fieldsArray.length) {
                fieldsToSelectors = props.fieldsArray.filter( field => !!field.filter_sort_index)
            } else {
                fieldsToSelectors = [];
            }
            return fieldsToSelectors
        })

        const createSelectOption = (field, multi) => {
            const newOption = {
                id: field.id,
                multi,
                title: field.title,
                options: (field.type.of).map(item => (
                    {
                        title: item,
                        value: item,
                    }))
            }
            selectorOptionsArr.value = {
                ...selectorOptionsArr.value,
                newOption
            }
        };
        const createEnumOption = async (field, id, multi) => {
            try {
                const enumObj = await enumsService.getEnumsObject(id);
                const  newOption = {
                    id,
                    multi,
                    title: field.title,
                    options: (enumObj.values).map(item => (
                        {
                            title: item.title,
                            value: item.id,
                        }))
                }
                selectorOptionsArr.value = {
                    ...selectorOptionsArr.value,
                    newOption
                }
            } catch (e) {
                console.log(e);
            }
        };
        const createDictionaryOption = async (field, id, multi) => {
            try {
                const sectionMaterials = await sectionsService.getSectionMaterials(id);
                const newOption = {
                    id,
                    multi,
                    title: field.title,
                    options: (sectionMaterials.data).map(item => (
                        {
                            title: item.name,
                            value: item.id,
                        }))
                }

                selectorOptionsArr.value = {
                    ...selectorOptionsArr.value,
                    newOption
                }

            } catch (e) {
                console.log(e);
            }
        };

        watch(filteredFields, async (newVal) => {
            if (newVal.length) {

                selectorOptionsArr.value = newVal.map( async (field) => {
                    switch (field.type.name) {
                        case 'Select':
                            createSelectOption(field, false);
                            break;

                        case 'Enum':
                            await createEnumOption(field, field.type.of, false);
                            break;

                        case 'Dictionary':
                            await createDictionaryOption(field, field.type.of, false);
                            break;

                        case 'List':
                            switch (field.type.of.name) {

                                case 'Enum':
                                    await createEnumOption(field, field.type.of.of, true);
                                    break;

                                case 'Dictionary':
                                    await createDictionaryOption(field, field.type.of.of, true);
                                    break;

                                case 'Select':
                                    createSelectOption(field, true);
                                    break;
                            }
                    }
                });
            }
            selectorOptionsArr.value = [];
        });

        return {
            selectorOptionsArr,
        }

    }
};
</script>

<style scoped>

</style>