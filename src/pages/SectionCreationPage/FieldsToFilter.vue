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
        <!-- Filters List -->
        <div class="lines">
            <div class="lines__item">
                <div class="lines__title">Локация
                </div>
                <div class="lines__btns">
                    <div class="btn-edit-sm btn-white">
                        <svg class="icon icon-chevron-up ">
                            <use xlink:href="img/svg/sprite.svg#chevron-up"></use>
                        </svg>
                    </div>
                    <div class="btn-edit-sm btn-white">
                        <svg class="icon icon-chevron-down ">
                            <use xlink:href="img/svg/sprite.svg#chevron-down"></use>
                        </svg>
                    </div>
                    <div class="btn-edit-sm btn-edit-sm--minus btn-danger">
                    </div>
                </div>
            </div>
            <div class="lines__item">
                <div class="lines__title">Материал обучения
                </div>
                <div class="lines__btns">
                    <div class="btn-edit-sm btn-white">
                        <svg class="icon icon-chevron-up ">
                            <use xlink:href="img/svg/sprite.svg#chevron-up"></use>
                        </svg>
                    </div>
                    <div class="btn-edit-sm btn-white">
                        <svg class="icon icon-chevron-down ">
                            <use xlink:href="img/svg/sprite.svg#chevron-down"></use>
                        </svg>
                    </div>
                    <div class="btn-edit-sm btn-edit-sm--minus btn-danger">
                    </div>
                </div>
            </div>
            <div class="lines__item">
                <div class="lines__title">Файлы от менеджера
                </div>
                <div class="lines__btns">
                    <div class="btn-edit-sm btn-white">
                        <svg class="icon icon-chevron-up ">
                            <use xlink:href="img/svg/sprite.svg#chevron-up"></use>
                        </svg>
                    </div>
                    <div class="btn-edit-sm btn-white">
                        <svg class="icon icon-chevron-down ">
                            <use xlink:href="img/svg/sprite.svg#chevron-down"></use>
                        </svg>
                    </div>
                    <div class="btn-edit-sm btn-edit-sm--minus btn-danger">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
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

       return {
           toggleDropDown,
           isDropDown,
           changeHandler,
       }
    },
};
</script>

<style scoped>

</style>