<template>
    <div class="form-wrap__input-wrap form-group">
        <div
            @click='toggleDropDown'
            class="form-wrap__input form-select toggle-dropdown"
        >Выберите поле
        </div>
        <!-- Dropdown -->
        <div
            :class='{active: isDropDown}'
            class="form-wrap__dropdown"
        >
            <div
                v-for="field in fieldsArr"
                :key='field?.id'
                class="form-wrap__dropdown-item"
            >
                <label class="dropdown-custom-input">
                    <input type="checkbox"
                           @change="changeHandler(field)"
                           :checked="field.filter_sort_index !== null"
                           name=""
                    />
                    <span class="dropdown-custom-input__title">
                       {{field?.title}}
                    </span>
                    <span class="dropdown-custom-input__circle"></span>
                </label>
            </div>
        </div>
    </div>
    <!-- Filters List -->
    <div class="lines">
        <div
            v-for="field in sortedFields"
            :key="field.id"
            class="lines__item"
        >
            <div class="lines__title">{{field?.title}}
            </div>
            <div class="lines__btns">
                <div
                    @click="sortFilterUp(field)"
                    class="btn-edit-sm btn-white">
                    <svg class="icon icon-chevron-up ">
                        <use xlink:href="img/svg/sprite.svg#chevron-up"></use>
                    </svg>
                </div>
                <div
                    @click="sortFilterDown(field)"
                    class="btn-edit-sm btn-white"
                >
                    <svg class="icon icon-chevron-down ">
                        <use xlink:href="img/svg/sprite.svg#chevron-down"></use>
                    </svg>
                </div>
                <div
                    @click="changeHandler(field)"
                    class="btn-edit-sm btn-edit-sm--minus btn-danger"
                >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, computed} from 'vue';
export default {
    props: {
        fieldsArr: {
            type: Array,
            default: () => [],
        }
    },
    setup(props, {emit}) {
       const isDropDown = ref(false);
       const toggleDropDown = () => {
           isDropDown.value = !isDropDown.value;
       };

       const sortedFields = computed(() => {
           return props.fieldsArr
               .filter((a) => a.filter_sort_index !== null)
               .sort((a, b) => a.filter_sort_index - b.filter_sort_index);
       })

       const findMaxFilterIdx = (arr) => {
           return arr.reduce((max, {filter_sort_index}) => {
               if (filter_sort_index === null || filter_sort_index < max) {
                   return max;
               } else {
                   return filter_sort_index
               }
           }, 1);
       };

       const changeHandler = (field) => {
           let newFields;
           const idx = props.fieldsArr.indexOf(field);
           const maxFilterIdx = findMaxFilterIdx(props.fieldsArr);

           if (field.filter_sort_index === null) {
               newFields = [
                   ...props.fieldsArr.slice(0, idx),
                   {...field, filter_sort_index: maxFilterIdx + 1},
                   ...props.fieldsArr.slice(idx + 1)
               ];
           } else {
               newFields = [
                   ...props.fieldsArr.slice(0, idx),
                   {...field, filter_sort_index: null},
                   ...props.fieldsArr.slice(idx + 1)
               ]
           }
           const toConsole = newFields.map((item) => (item.title + ' filter_sort_index: ' + item.filter_sort_index));
           console.log(toConsole);
           emit('update-filter-sort', newFields)
       }

       const sortFilterUp = (filter) => {
           const idxInSortedArr = sortedFields.value.indexOf(filter);
           if (idxInSortedArr > 0) {
               const filterToDec = sortedFields.value[idxInSortedArr - 1];
               const lowerSortIdx = filter.filter_sort_index;
               const higherSortIdx = filterToDec.filter_sort_index;
               const filterIdxInFieldsArray = props.fieldsArr.indexOf(filter);
               const filterToDecIdxInFieldsArray = props.fieldsArr.indexOf(filterToDec);
               const updFilterToDec = {...filterToDec, filter_sort_index: lowerSortIdx};
               const updFilter = {...filter, filter_sort_index: higherSortIdx};
               const newFiltersArr = [...props.fieldsArr];

               newFiltersArr[filterIdxInFieldsArray] = updFilter;
               newFiltersArr[filterToDecIdxInFieldsArray] = updFilterToDec;

               emit('update-filter-sort', newFiltersArr);
           }
        };
        const sortFilterDown = (filter) => {
            const idxInSortedArr = sortedFields.value.indexOf(filter);
            if (idxInSortedArr < sortedFields.value.length - 1) {
                const filterToInc = sortedFields.value[idxInSortedArr + 1];
                const lowerSortIdx = filterToInc.filter_sort_index;
                const higherSortIdx = filter.filter_sort_index;
                const filterIdxInFieldsArray = props.fieldsArr.indexOf(filter);
                const filterToIncIdxInFieldsArray = props.fieldsArr.indexOf(filterToInc);
                const updFilterToInc = {...filterToInc, filter_sort_index: higherSortIdx};
                const updFilter = {...filter, filter_sort_index: lowerSortIdx};
                const newFiltersArr = [...props.fieldsArr];

                newFiltersArr[filterIdxInFieldsArray] = updFilter;
                newFiltersArr[filterToIncIdxInFieldsArray] = updFilterToInc;

                emit('update-filter-sort', newFiltersArr);
            }
        };

       return {
           toggleDropDown,
           isDropDown,
           changeHandler,
           sortedFields,
           sortFilterUp,
           sortFilterDown,
       }
    },
};
</script>

<style scoped>

</style>