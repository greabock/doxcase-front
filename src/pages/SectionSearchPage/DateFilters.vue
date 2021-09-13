<template>
    <div v-if="filteredFields?.length">
        <div v-for="(field, index) of filteredFields" :key="index">
            <DateFiltersRange :title="field?.title" @update="$emit('update:modelValue', $event)" :value="modelValue" />
        </div>
    </div>
</template>

<script>
import {computed} from 'vue';
import DateFiltersRange from './DateFiltersRange';

export default {
    components: {DateFiltersRange},
    props: {
        fieldsArray: {
            type: Array,
            default: () => [],
        },
        modelValue: {
            type: Array,
            default: () => [],
        },
    },

    setup(props) {
        const filteredFields = computed(() => {
            return props.fieldsArray.filter((field) => field.type.name === 'Date');
        });

        return {
            filteredFields,
        };
    },
};
</script>

<style scoped>
.data-values-cont {
    display: flex;
}
.mar-right-5 {
    margin-right: 5px;
}

.text-label {
    font-size: 12px;
}
</style>
