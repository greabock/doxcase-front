<template>
    <div
        v-show="modelValue"
        @click="wrapperClickHandler"
        class="modal-window__wrapper"
        id="mob-modal-wrapper"
    >
        <div
            class="modal-window__cont fancybox__content"
            :style="{
                maxWidth: maxWidth,
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
        maxWidth: {
            type: String,
            default: '600px',
        },
        modelValue: Boolean,
    },
    emits: ['close', 'update:modelValue'],
    setup(props, ctx) {
        const wrapperClickHandler = (e) => {
            if (e.target.id === 'mob-modal-wrapper') {
                ctx.emit('update:modelValue', false);
                ctx.emit('close');
            }
        }
        const close = () => {
            ctx.emit('update:modelValue', false);
            ctx.emit('close');
        };
        return {
            close,
            wrapperClickHandler,
        };
    },
};
</script>

<style lang="scss">
.modal-window__wrapper {
    --carousel-button-svg-stroke-width: 2;
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
.modal-window__cont {
    display: flex;
    position: relative;
    flex-direction: column;
    background-color: #fff;
    padding: 32px;
    border-radius: 5px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
    margin: 5vh auto;
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
