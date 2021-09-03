<template>
    <div class="text__container">
        <textarea
            :class="['input-line__input form-control', {'is-invalid': error}]"
            name="textarea"
            :placeholder="placeholder"
            :value="modelValue"
            @input="(e) => $emit('update:modelValue', e.target.value)"
            @blur="(e) => $emit('blur', e.target.value)"
        />
        <div class="input-message invalid-feedback" v-if="error">{{ error }}</div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: String,
        error: String,
        placeholder: String,
    },
    setup() {},
};
</script>

<style scoped>
.text__container {
    position: relative;
    margin-bottom: 1rem;
}

.input-message {
    display: block;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    padding: 5px 1rem;
}
</style>
