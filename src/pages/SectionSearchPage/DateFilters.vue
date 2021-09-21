<template>
    <div v-if="filteredFields?.length">
        <div v-for="(field, index) of filteredFields" :key="index">
            <DateFiltersRange :title="field?.title" @update:modelValue="e => updateDates(field.id, e)" v-model="dates[field.id]" />
        </div>
    </div>
</template>

<script>
import {computed, ref, watch} from 'vue';
import DateFiltersRange from './DateFiltersRange';

export default {
    components: {DateFiltersRange},
    props: {
        fieldsArray: {
            type: Array,
            default: () => [],
        },
        modelValue: {
            type: Object,
            default: () => {},
        },
    },

    setup(props, {emit}) {
        const filteredFields = computed(() => {
            return props.fieldsArray.filter((field) => field.type.name === 'Date');
        });

        const dates = ref({});

        const updateDates = (id, datesList) => {
            if(!datesList[0] && !datesList[1]) {
                const _dates = {...dates.value}
                delete _dates[id]
                emit('update:modelValue', _dates)
                return;
            }

            emit('update:modelValue', dates.value)
        }

        watch(() => props.modelValue, () => {
            if (!Object.keys(props.modelValue).length) {
                for(const i in dates.value) {
                    dates.value[i] = [];
                }
            }
        })

        return {
            filteredFields,
            dates,
            updateDates,
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
