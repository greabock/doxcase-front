<template>
    <button :class="['btn', btnClassName, size ? `btn-${size}` : '']" type="submit">
        <template v-if="isLoad">
            <div class="btn-loader"></div>
        </template>
        <slot v-else></slot>
    </button>
</template>

<script>
import {computed} from '@vue/runtime-core';
export default {
    props: {
        isLoad: Boolean,
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
    display: flex;
    justify-content: center;
}

.btn-loader {
    border: 2px solid #fff;
    border-radius: 50%;
    border-right-color: transparent;
    border-top-color: transparent;
    width: 1.5rem;
    height: 1.5rem;
    animation: dual-ring 1s linear  infinite;
}

@keyframes dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
