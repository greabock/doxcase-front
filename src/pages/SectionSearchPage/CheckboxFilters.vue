<template>
    <div class="sSearchResult__aside-group">
        <label
            v-for="item in filteredFields"
            :key="item.id"
            class="custom-input form-check">
            <input
                @change="(e) => updateCheckboxHandler(e, item)"
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
        }
    },
    setup(props, {emit}) {
        console.log(props.fieldsArray);

       const filteredFields = computed(() => {
           return props.fieldsArray.filter((field) => field.type.name === 'Boolean');
       });
       const updateCheckboxHandler = (event, item) => {
           emit('updateCheckbox', { name: item.id, value: event.target.checked ? 1 : 0})
           };

    return {
        filteredFields,
        updateCheckboxHandler,
        }
    }
};
</script>

<style scoped>

</style>