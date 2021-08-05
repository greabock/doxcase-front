<template>
    <label class="checkbox-input__container">
        <input
            class="form-check-input checkbox-input"
            name="checkbox"
            type="checkbox"
            @change="changeValue"
            :checked="modelValue"
            v-bind="$attrs"
        />
        <span class="checkbox-input__text">
            <slot></slot>
        </span>
    </label>
</template>

<script>
export default {
    props: {
        modelValue: Boolean,
        disabled: Boolean,
    },
    setup(props, ctx) {
        const changeValue = (e) => {
            ctx.emit('update:modelValue', e.target.checked);
        };

        return {
            changeValue,
        };
    },
};
</script>

<style lang="scss" scoped>
.checkbox-input__container {
    display: flex;
    min-height: 1.5rem;
    padding-left: 1.5em;
    cursor: pointer;
}

.checkbox-input {
    border-radius: 0.25em;
    margin-left: -1.5em;
}
</style>
