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
        >
        </fields-list-item>
    </div>
</template>

<script>
import FieldsListItem from './FieldsListItem';
export default {
    components: {FieldsListItem},
    props: {
        fieldsArr: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, {emit}) {

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
        };
    },
};
</script>

<style scoped>
</style>
