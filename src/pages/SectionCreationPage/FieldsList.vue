<template>
    <div
        v-for="(field, i) in fieldsArr"
        :key="field?.id"
        class="sSectionMain__item"
    >
        <fields-list-item
            :idx="i + 1"
            :field="field"
            @sort-field-down="sortFieldDown"
            @sort-field-up="sortFieldUp"
            @remove-field="removeField"
            @change-field="changeField"
            :allEnums="allEnums"
            :allSections="allSections"
        >
        </fields-list-item>
    </div>
</template>

<script>
import FieldsListItem from '@/pages/SectionCreationPage/FieldsListItem';

export default {
    components: {FieldsListItem},
    props: {
        allEnums: {
          type: Array,
        },
        allSections: {
            type: Array,
        },
        fieldsArr: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['change-field', 'sort-field-up', 'sort-field-down', 'remove-field'],
    setup(props, {emit}) {

        const changeField = (item) => {
            emit('change-field', item);
        }
        const sortFieldUp = (item) => {
            emit('sort-field-up', item);
        };
        const sortFieldDown = (item) => {
            emit('sort-field-down', item);
        };
        const removeField = (item) => {
            emit('remove-field', item);
        };

        return {
            sortFieldUp,
            sortFieldDown,
            removeField,
            changeField,
        };
    },
};
</script>

<style scoped>
</style>
