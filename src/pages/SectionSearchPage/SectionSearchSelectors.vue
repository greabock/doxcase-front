<template>
    <div class="customs-select">
        <div v-if="selectorOptionsArr">
            <div class="row">
                <div v-for="item of selectorOptionsArr" :key="item?.id" class="col-auto">
                    <div v-if="item" class="customs-select__input-wrap form-group">
                        <FilterSelect
                            class="mb-3"
                            :title="item?.title"
                            v-model="item.selectValue"
                            :options="item.options"
                        />
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
import FilterSelect from '@/components/FilterSelect';

export default {
    components: {
        FilterSelect,
    },
    props: {
        fieldsArray: {
            type: Array,
            default: () => [],
        },
        allSections: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['updateSelectors, isSelectsLoading'],

    setup(props, {emit}) {
        const selectorOptionsArr = ref([]);

        const filteredFields = computed(() => {
            let fieldsToSelectors;
            if (props.fieldsArray.length) {
                fieldsToSelectors = props.fieldsArray
                    .filter(
                        (field) =>
                            field.type.name === 'Enum' ||
                            field.type.name === 'Dictionary' ||
                            field.type.name === 'Select' ||
                            field.type.name === 'List'
                    );
            } else {
                fieldsToSelectors = [];
            }
            return fieldsToSelectors;
        });

        const createSelectOption = (field, opts, multi) => {
            return {
                selectValue: [],
                id: field.id,
                multi,
                title: field.title,
                options: opts.map((item) => ({
                    key: item,
                    name: item,
                })),
            };
        };
        const createEnumOption = async (field, id, multi) => {
            try {
                const enumObj = await enumsService.getEnumsObject(id);
                return {
                    selectValue: [],
                    id: field.id,
                    multi,
                    title: field.title,
                    options: enumObj.values.map((item) => ({
                        name: item.title,
                        key: item.id,
                    })),
                };
            } catch (e) {
                console.log(e);
            }
        };
        const createDictionaryOption = async (field, id, multi) => {
            try {
                const sectionMaterials = await sectionsService.getSectionMaterials(id);
                return {
                    selectValue: [],
                    id: field.id,
                    multi,
                    title: field.title,
                    options: sectionMaterials.data.map((item) => ({
                        name: item.name,
                        key: item.id,
                    })),
                };
            } catch (e) {
                console.log(e);
            }
        };

        watch(
            filteredFields,
            async (newVal) => {
                emit('isSelectsLoading', true);
                selectorOptionsArr.value = await Promise.all(
                    newVal.map(async (field) => {
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
                    })
                );
                emit('isSelectsLoading', false);
            },
            {deep: true}
        );

        watch(
            selectorOptionsArr,
            (newOptsArr) => {
                let newSelectors = {};

                newOptsArr.forEach((item) => {
                    if (item && item.selectValue && item.selectValue.length) {
                        newSelectors[item.id] = item.selectValue.map((item) => item.key);
                    }
                });
                emit('updateSelectors', newSelectors);
            },
            {deep: true}
        );

        return {
            selectorOptionsArr,
        };
    },
};
</script>

<style>
.customs-select__input-wrap .form-control-md {
    padding: 1.2rem 1rem 0.5rem;
 }
</style>
