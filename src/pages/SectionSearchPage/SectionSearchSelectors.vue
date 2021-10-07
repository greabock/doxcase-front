<template>
    <div class="customs-select">
        <div v-if="selectorOptionsArr">
            <div class="row">
                <div
                    v-for="item of selectorOptionsArr"
                    :key="item?.id"
                    class="col-auto filter-selector-wrapper"
                >
                    <div v-if="item" class="customs-select__input-wrap form-group">
                        <FilterSelect
                            class="mb-3"
                            :title="item?.title"
                            v-model="item.selectValue"
                            :options="item.options"
                            @select="updateOptionsHandler"
                        />
                    </div>
                </div>
                <div
                    v-if="!filteredFields.length"
                    class='d-lg-none'>
                    Фильтры не добавлены
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import FilterSelect from '@/components/FilterSelect';

export default {
    components: {
        FilterSelect,
    },
    props: {
        selectorOptionsArr: {
            type: Array,
            default: () => []
        },
        filteredFields: {
            type: Array,
            default:() => []
        }
    },
    emits: ['updateSelectors'],

    setup(props, {emit}) {

        const updateOptionsHandler = () => {
            let newSelectors = {};
            props.selectorOptionsArr.forEach((item) => {
                if (item && item.selectValue && item.selectValue.length) {
                    newSelectors[item.id] = item.selectValue.map((item) => item.key);
                }
            });
            emit('updateSelectors', newSelectors);
        }

        return {
            updateOptionsHandler
        };
    },
};
</script>

<style>
.customs-select__input-wrap .form-control-md {
    padding: 1.2rem 1rem 0.5rem;
 }

@media (max-width: 974px) {
    .filter-selector-wrapper {
        width: 100%;
    }
}
</style>
