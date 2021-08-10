<template>
    <button :class="['btn', btnClassName, size ? `btn-${size}` : '']" type="submit">
        <slot></slot>
    </button>
</template>

<script>
import {computed} from '@vue/runtime-core';
export default {
    props: {
        type: {
            type: String,
            default: 'button',
        },
        color: {
            type: String,
            default: 'primary',
        },
        size: String,
        outline: Boolean,
    },
    setup(props) {
        const btnClassName = computed(() => {
            return `btn${props.outline ? '-outline' : ''}${props.color ? '-' + props.color : ''}`;
        });

        return {btnClassName};
    },
};
</script>

<style lang="scss" scoped>
.btn {
    border-radius: 150px;
}
</style>
