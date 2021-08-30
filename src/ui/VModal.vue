<template>
    <div class="modal__container" v-if="modelValue">
        <div
            class="modal"
            :style="{
                width: width,
            }"
        >
            <BtnClose class="modal__close" @click="close" />

            <slot></slot>
        </div>
    </div>
</template>
<script>
import BtnClose from './icons/close.svg.vue';

export default {
    components: {
        BtnClose,
    },
    props: {
        width: {
            type: String,
            default: '600px',
        },
        modelValue: Boolean,
    },
    setup(props, ctx) {
        const close = () => {
            ctx.emit('update:modelValue', false);
            ctx.emit('close');
        };
        return {close};
    },
};
</script>

<style lang="scss" scoped>
.modal__container {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100vh;
    z-index: 50;
}

.modal {
    padding: 32px;
    background: #ffffff;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
    border-radius: 5px;
    position: relative;
}

.modal__close {
    stroke: #000;
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
}
</style>
