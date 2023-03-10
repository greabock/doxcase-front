<template>
    <div class="input__container">
        <div v-if="title" class="input__title">
            {{ title }}
        </div>
        <div
            v-if="$slots.left"
            :class="['input__left-icon', {input__left_title: title}]"
            :style="{
                width: offsetLeft || offset,
            }"
        >
            <slot name="left"></slot>
        </div>
        <input
            :class="[
                'form-control input__element',
                size ? `form-control-${size}` : '',
                {'input__left-offset': $slots.left},
                {'input__right-offset': $slots.right},
                {input_shadow: shadow},
                {input_bordered: bordered},
                {input_title: title},
                {'is-invalid': error},
                classInput,
            ]"
            :style="{
                'padding-left': $slots.left ? offsetLeft || offset : '',
                'padding-right': $slots.right ? offsetRight || offset : '',
            }"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            type="text"
            v-bind="inputListeners"
            :value="modelValue || ''"
        />
        <div class="input-message invalid-feedback" v-if="error">{{ error }}</div>
        <div
            v-if="$slots.right"
            :class="['input__right-icon', {input__right_title: title}]"
            :style="{
                width: offsetRight || offset,
            }"
        >
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
import {computed} from '@vue/runtime-core';

export default {
    // inheritAttrs: false,
    props: {
        modelValue: String,
        placeholder: String,
        classInput: String,
        bordered: Boolean,
        shadow: Boolean,
        disabled: Boolean,
        readonly: Boolean,
        size: String,
        offset: String,
        offsetRight: String,
        offsetLeft: String,
        error: String,
        title: String,
    },
    setup(props, ctx) {
        const inputListeners = computed(() => ({
            ...ctx.attrs,
            onInput: (e) => {
                ctx.emit('input', e);
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
    margin-bottom: 1rem;
}

.input__element {
    border-color: transparent;
}

.is-invalid {
    border-color: #eb5757;
}

.input_shadow {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
}

.input_bordered {
    border: 1px solid #d6d6d6;
}

.input__left-icon {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 3rem;
    height: 100%;
}

.input__right-icon {
    position: absolute;
    display: flex;
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

.form-control-md {
    min-height: calc(1em + 1rem + 2px);
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.3rem;
}

.input-message {
    display: block;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    padding: 5px 1rem;
}

.input__title {
    color: #6e6e6e;
    margin-bottom: 0.1rem;
    font-size: 14px;
    position: absolute;
    padding: 0.5rem 1rem;
}

.input_title {
    padding-top: 2rem;
}

.input__right_title,
.input__left_title {
    padding-top: 1rem;
}
</style>
