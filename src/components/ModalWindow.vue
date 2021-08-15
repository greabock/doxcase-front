<template>
    <div v-if="modelValue" class="modal-window__wrapper">
        <div
            class="modal-window__cont fancybox__content"
            :style="{
                maxWidth: width,
            }"
        >
            <button class="carousel__button is-close" title="Close" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg>
            </button>
            <slot></slot>

        </div>
    </div>
</template>
<script>

export default {
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

<style lang="scss">
.modal-window__wrapper {
    display: flex;
    z-index: 10;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
}
.modal-window__cont {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 400px;
    background-color: #fff;
    padding: 32px;
    border-radius: 5px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
}
.modal-window__header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
}
.modal-window__closer {
    display: block;
    position: absolute;
    font-size: 26px;
    line-height: 26px;
    top: 15px;
    right: 20px;
    cursor: pointer;
}
.modal-window__buttons {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
.modal-window__buttons button:first-child {
    margin-right: 5px;
}
</style>
