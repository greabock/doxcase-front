<template>
    <div>
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
    </div>
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
    margin-right: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.25)
}
</style>
