<template>
    <div ref="root" class="select__container">
        <div
            :class="[
                'form-control select__element',
                {select__element_border: bordered},
                {select__element_shadow: shadow},
                {select__element_active: isActive},
                {'is-invalid': error},
            ]"
            @click="isActive = true"
        >
            <div v-if="title" class="select__title">
                {{ title }}
            </div>
            <div class="select__input">
                <div>
                    <template v-if="modelValue && modelValue.length">
                        <VBox class="me-1 mt-1" v-for="(item, key) of modelValue" :key="key" :title="item.name" @delete="select(item)" />
                    </template>
                    <input ref="input" class="me-1 mt-1 input__search" :placeholder="(modelValue && modelValue.length) ? '' : placeholder" v-model="privateValue" />
                </div>
                <div @click.stop="isActive = !isActive" :class="['select__arrow', {select__arrow_up: isActive}]">
                    <ArrowDown class="select__icon" />
                </div>
            </div>
        </div>
        <div class="input-message invalid-feedback" v-if="error">{{ error }}</div>

        <ul class="select-list__container" v-if="isActive">
            <li
                v-for="(item, i) of privateOptions"
                :key="i"
                :class="['select-list__item', {'select-list__item_active': isActiveElement(item)}]"
                @click="select(item)"
            >
                <slot name="option" :item="item">
                    {{ item.name }}
                </slot>
                <MarkIcon v-if="isActiveElement(item)" class="select__mark" />
            </li>
            <li class="select-list__not-data" v-if="!privateOptions.length">Нет данных</li>
        </ul>
    </div>
</template>

<script>
import {ref, computed} from 'vue';
import { onMounted, onUnmounted} from '@vue/runtime-core';
import ArrowDown from './icons/arrow-down.svg.vue';
import MarkIcon from './icons/mark.svg.vue';
import VBox from '@/ui/VBox';

function outsideSub(fn) {
    global.addEventListener('focusin', fn);
    global.addEventListener('click', fn);
}

function outsideUnsub(fn) {
    global.removeEventListener('focusin', fn);
    global.removeEventListener('click', fn);
}

export default {
    components: {
        ArrowDown,
        MarkIcon,
        VBox,
    },
    props: {
        modelValue: Array,
        options: Array,
        title: String,
        shadow: Boolean,
        bordered: Boolean,
        disabled: Boolean,
        placeholder: String,
        error: String,
    },
    setup(props, ctx) {
        const root = ref(null);
        const isActive = ref(false);

        const isActiveElement = (item) => {
            if (props.modelValue && props.modelValue.length) {
                return props.modelValue.findIndex((x) => x.key === item.key) >= 0;
            }

            return false;
        };

        const hide = (event) => {
            if (!isActive.value) {
                return;
            }

            if (!root.value.contains(event.target)) {
                isActive.value = false;
                privateValue.value = null;
            }

            ctx.emit('blur', props.modelValue);
        };

        onMounted(() => {
            outsideSub(hide);
        });

        onUnmounted(() => {
            outsideUnsub(hide);
        });

        const select = (item) => {
            let multipleSelect = Array.isArray(props.modelValue) ? props.modelValue : [];
            privateValue.value = null;

            const index = multipleSelect.findIndex((x) => x.key === item.key);

            if (multipleSelect[index]) {
                multipleSelect.splice(index, 1);
            } else {
                multipleSelect = [...multipleSelect, item];
            }
            ctx.emit('update:modelValue', multipleSelect);
            ctx.emit('select', multipleSelect);
        };

        const privateValue = ref(null);
        const privateOptions = computed(() =>
            props.options.filter((str) => {
                if (privateValue.value) {
                    return str.name.toString().toLowerCase().includes(privateValue.value.toLowerCase());
                }
                return props.options;
            })
        );

        return {isActive, root, select, isActiveElement, privateOptions, privateValue};
    },
};
</script>

<style lang="scss" scoped>
// @import './scss/variable';
$blue: var(--bs-primary);

.select__container {
    position: relative;
    margin-bottom: 1rem;
}

.select__element {
    width: 100%;
    background: #fff;
    border-radius: 5px;
    border: 1px solid transparent;
    cursor: pointer;
}

.select__element_border {
    border-color: #d6d6d6;
}

.select__element_shadow {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
}

.select__input-placeholder {
    color: #d6d6d6;
}

.select__input {
    display: flex;
    justify-content: space-between;
    // color: var(--bs-primary);
}

.select__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    height: 100%;
    cursor: pointer;
    // width: 3rem;
    padding: 0.3rem 0;
}

.select__arrow_up {
    transform: rotate(180deg);
}

.select-list__container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    list-style: none;
    margin: 0;
    margin-top: 5px;

    padding: 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    transform: translateY(100%);
    border-radius: 0 0 4px 4px;

    border: 1px solid #f8f8f8;
    box-sizing: border-box;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
    z-index: 20;
    background-color: #fff;
    
    max-height: 14rem;
    overflow: auto;
}

.select-list__item {
    margin: 0;
    cursor: pointer;
    color: var(--bs-primary);
    padding: 0.5rem 1rem;
    position: relative;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        background-color: #f8f8f8;
    }

    &_active {
        color: var(--bs-primary);
    }
}

.select-list__not-data {
    margin: 0;
    padding: 0.2rem 1rem;
    color: rgba(var(--bs-primary), 0.5);
}

.select__icon {
    stroke: var(--bs-primary);
}

.select-list__item_active {
    font-weight: 500;
}

.select__title {
    color: #6e6e6e;
    margin-bottom: 0.1rem;
}

.input-message {
    display: block;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    padding: 5px 1rem;
}

.is-invalid {
    border-color: #eb5757;
}

.select__element_active{
    box-shadow: 0 0 0 0.25rem var(--bs-focus-shadow-color);
};

.select__mark {
    height: 0.8rem;
}

.input__search {
    border: none;
    outline: none;
    max-width: 100%;
}

.input__search::placeholder {
    color: #d6d6d6;
}
</style>
