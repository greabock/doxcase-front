<template>
    <div class="customs-select">
        <div v-if="selectorOptionsArr">
        <div class="row">
                <div
                    v-for="item of selectorOptionsArr"
                    :key="item?.id"
                    class="col-auto">
                    <div v-if="item" class="customs-select__input-wrap form-group">
                        <label>
                            <span class="customs-select__input-title">{{item?.title}}</span>
                            <select
                                :multiple='item?.multi'
                                v-model='item.selectValue'
                                class="customs-select__input form-select custom-select"
                                @change="changeHandler(item?.id, item?.selectValue)"
                            >
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

    setup(props, {emit}) {
        const selectorOptionsArr = ref([]);

        const filteredFields = computed(() => {
            let fieldsToSelectors;
            if (props.fieldsArray.length) {
                fieldsToSelectors = props.fieldsArray.filter( field => !!field.filter_sort_index)
                    .filter(field => field.type.name === "Enum" || field.type.name === "Dictionary" ||
                        field.type.name === "Select" || field.type.name === 'List' );
            } else {
                fieldsToSelectors = [];
            }
            return fieldsToSelectors
        })

        const createSelectOption = (field, opts, multi) => {

            return {
                selectValue: multi ? [] : '',
                id: field.id,
                multi,
                title: field.title,
                options: opts.map(item => (
                    {
                        title: item,
                        value: item,
                    }))
            }
        };
        const createEnumOption = async (field, id, multi) => {
            try {
                const enumObj = await enumsService.getEnumsObject(id);
                return {
                    selectValue: multi? '' : [],
                    id,
                    multi,
                    title: field.title,
                    options: (enumObj.values).map(item => (
                        {
                            title: item.title,
                            value: item.id,
                        }))
                }
            } catch (e) {
                console.log(e);
            }
        };
        const createDictionaryOption = async (field, id, multi) => {
            try {
                const sectionMaterials = await sectionsService.getSectionMaterials(id);
                return {
                    selectValue: multi? '' : [],
                    id,
                    multi,
                    title: field.title,
                    options: (sectionMaterials.data).map(item => (
                        {
                            title: item.name,
                            value: item.id,
                        }))
                }

            } catch (e) {
                console.log(e);
            }
        };

        watch(filteredFields, async (newVal) => {

                selectorOptionsArr.value = await Promise.all(newVal.map( async (field) => {
                    switch (field.type.name) {
                        case 'Select':
                            return createSelectOption(field, field.type.of, false);

                        case 'Enum':
                            return await createEnumOption(field, field.type.of, false);

                        case 'Dictionary':
                            return await createDictionaryOption(field, field.type.of, false);

                        case 'List':
                            switch (field.type.of.name) {

                                case 'Select':
                                    return createSelectOption(field, field.type.of.of, true);

                                case 'Enum':
                                    return await createEnumOption(field, field.type.of.of, true);

                                case 'Dictionary':
                                    return await createDictionaryOption(field, field.type.of.of, true);
                            }
                    }
             }));
        }, {deep: true});

        const changeHandler = (id, value) => {

               let payload;
            if (!value.length) {
               payload = [value];
            } else {
                payload = value;
            }
            emit('updateSelector', {name: id, value: payload});
        }

        return {
            selectorOptionsArr,
            changeHandler
        }

    }
};
</script>

<style scoped>

</style>