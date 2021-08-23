<template>
    <div class="sSearchResult__aside-group">
        <label
            v-for="item in filteredFields"
            :key="item.id"
            class="custom-input form-check">
            <input
                :value="item.id"
                :checked='modelValue.includes(item.id)'
                @change='e => changeHandler(e.target.value)'
                class="custom-input__input form-check-input"
                type="checkbox"
            />
            <span class="custom-input__text form-check-label">{{item.title}}</span>
        </label>
    </div>
</template>

<script>
import { computed } from 'vue';
export default {
    props: {
        fieldsArray: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: Array,
        default: () => []
        }
    },
    setup(props, {emit}) {

       const filteredFields = computed(() => {
           return props.fieldsArray.filter((field) => field.type.name === 'Boolean');
       });
        const changeHandler = (cbValue) => {
            let updCheckboxes;
            if (props.modelValue.includes(cbValue)) {
                updCheckboxes = props.modelValue.filter(value => value !== cbValue);
            } else {
                updCheckboxes = props.modelValue.concat(cbValue);
            }
            emit('update:modelValue', updCheckboxes);
        };

    return {
        filteredFields,
        changeHandler,
        }
    }
};
</script>

<style scoped>

</style>