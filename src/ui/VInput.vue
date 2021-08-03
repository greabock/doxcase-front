<template>
    <div class="input__container">
        <div class="input__left-icon">
            <slot name="left"></slot>
        </div>
        <input
            :class="[
                'form-control',
                {'input__left-offset': $slots.left},
                {'input__right-offset': $slots.right},
                classInput,
            ]"
            type="text"
            v-bind="inputListeners"
            :value="modelValue"
        />
        <div class="input__right-icon">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
import {computed} from '@vue/runtime-core';

export default {
    inheritAttrs: false,
    props: {
        placeholder: String,
        modelValue: String,
        classInput: String,
    },
    setup(props, ctx) {
        console.log(props);
        const inputListeners = computed(() => ({
            ...ctx.attrs,
            onInput: (e) => {
                ctx.emit('input', e.target.value);
                ctx.emit('update:modelValue', e.target.value);
            },
        }));

        return {
            inputListeners,
        };
    },
};
</script>

<style lang="scss" scoped>
.input__container {
    position: relative;
}

.input__left-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 100%;
}

.input__right-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 3rem;
    height: 100%;
}

.input__left-offset {
    padding-left: 3rem;
}

.input__right-offset {
    padding-right: 3rem;
}
</style>
