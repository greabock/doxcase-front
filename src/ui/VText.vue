<template>
    <textarea
        class="input-line__input form-control"
        name="textarea"
        :placeholder="placeholder"
        :value="modelValue"
        @input="(e) => $emit('update:modelValue', e.target.value)"
    >
    </textarea>
</template>

<script>
export default {
    props: {
        modelValue: String,
    },
    setup() {},
};
</script>
