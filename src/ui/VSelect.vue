<template>
    <div ref="root" class="select__container">
        <VInput
            v-model="privateSelected"
            :placeholder="placeholder"
            :classInput="classInput"
            :bordered="bordered"
            :shadow="shadow"
            :disabled="disabled"
            :readonly="readonly"
            :size="size"
            @focus="isActive = true"
            @input="search"
        >
            <template #right>
                <div @click="isActive = !isActive" :class="['select__arrow', {select__arrow_up: isActive}]">
                    <ArrowDown class="select__icon" />
                </div>
            </template>
        </VInput>
        <ul class="select-list__container" v-if="isActive">
            <li
                v-for="(item, i) of privateOptions"
                :key="i"
                :class="['select-list__item', {'select-list__item_active': modelValue && item.key === modelValue.key}]"
                @click="select(item)"
            >
                <slot name="option" :item="item">
                    {{ item.name }}
                </slot>
            </li>
            <li class="select-list__not-data" v-if="!privateOptions.length">Нет данных</li>
        </ul>
    </div>
</template>

<script>
import {ref} from 'vue';

import VInput from './VInput.vue';
import ArrowDown from './icons/arrow-down.svg.vue';

import {onMounted, onUnmounted} from '@vue/runtime-core';

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
        VInput,
        ArrowDown,
    },
    props: {
        modelValue: Object,
        options: Array,
        placeholder: String,
        classInput: String,
        bordered: Boolean,
        shadow: Boolean,
        disabled: Boolean,
        readonly: Boolean,
        size: String,
        multiple: Boolean,
    },
    setup(props, ctx) {
        const root = ref(null);
        const isActive = ref(false);

        const privateOptions = ref(props.options);
        const search = (e) => {
            const value = e.target.value;
            if (value) {
                privateOptions.value = props.options.filter((str) => {
                    return str.name.toString().includes(value);
                });
            } else {
                privateOptions.value = props.options;
            }
        };

        const privateSelected = ref('');
        const multipleSelect = ref([])

        const hide = (event) => {
            if (!root.value.contains(event.target)) {
                isActive.value = false;
                privateOptions.value = props.options;
                if (props.modelValue) {
                    privateSelected.value = props.modelValue.name.toString();
                }
            }
        };

        onMounted(() => {
            outsideSub(hide);
        });

        onUnmounted(() => {
            outsideUnsub(hide);
        });

        const select = (item) => {
            if (props.multiple) {
                const index = multipleSelect.value.findIndex(x => x.key === item.key)

                if (multipleSelect.value[index]) {
                    multipleSelect.value.splice(index, 1);
                } else {
                    multipleSelect.value = [...multipleSelect.value, item]
                }
                privateSelected.value = multipleSelect.value.map(x => x.name.toString()).join(', ');
                ctx.emit('update:modelValue', multipleSelect);
            } else {
                isActive.value = false;
                ctx.emit('update:modelValue', item);
                privateSelected.value = item.name.toString();
            }
        };

        return {isActive, root, select, privateSelected, privateOptions, search};
    },
};
</script>

<style lang="scss" scoped>
@import './scss/variable';

.select__container {
    position: relative;
}

.select__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    height: 100%;
    cursor: pointer;
    width: 3rem;
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
}

.select-list__item {
    margin: 0;
    cursor: pointer;
    color: $blue;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    position: relative;
    font-size: 15px;

    &:hover {
        background-color: #f8f8f8;
    }

    &_active {
        color: $blue;
    }
}

.select-list__not-data {
    margin: 0;
    padding: 0.2rem 1rem;
    color: rgba($blue, 0.5);
}

.select__icon {
    stroke: $blue;
}
</style>
