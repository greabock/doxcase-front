<template>
    <label class="search-radio__label"
    >
        <input
            :value="section?.id"
            @change="$emit('update:modelValue', $event.target.value)"
            :checked="section?.id === modelValue"
            type="radio"
            class="btn-check"
        />
        <span class="btn btn-info btn-sm">{{ section?.title}}</span>
    </label>
</template>

<script>
export default {
props: {
    section: {
        type: Object,
        default:() => ({
            id: '',
            title: 'Все'
        })
    },
    modelValue: {
        type: String,
        default: null
    }
}
};
</script>

<style scoped>
.search-radio__label {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>