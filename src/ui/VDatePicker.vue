<template>
    <div ref="root" class="datepicker__container">
        <VInput
            v-model="privateDate"
            @focus="isActive = true"
            v-maska="'##.##.####'"
            :placeholder="placeholder"
            :error="error"
            bordered
        >
            <template #right>
                <div @click="isActive = !isActive">
                    <div class="date__icon">
                        <DateIcon />
                    </div>
                </div>
            </template>
        </VInput>
        <VCalendar
            :style="{
                width: size || 'auto',
            }"
            :modelValue="modelValue"
            @selected="selectedDate"
            v-if="isActive"
            class="datepicker__calendar"
        />
    </div>
</template>

<script>
import {ref} from '@vue/reactivity';
import VCalendar from './VCalendar';
import VInput from './VInput';
import {computed, onMounted, onUnmounted} from '@vue/runtime-core';
import DateIcon from './icons/date.svg.vue';
import {maska} from 'maska';
import {debounce} from 'lodash';

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
        DateIcon,
        VCalendar,
    },
    directives: {maska},
    props: {
        size: String,
        modelValue: [Date, String],
        placeholder: String,
        error: String,
    },
    setup(props, ctx) {
        const root = ref(null);
        const isActive = ref(false);

        const privateDate = computed({
            get: () => {
                if (props.modelValue) {
                    const d = new Date(props.modelValue);
                    const day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
                    const month = d.getMonth() + 1;
                    const monthFormat = month > 9 ? month : '0' + month;
                    const year = d.getFullYear();

                    return `${day}.${monthFormat}.${year}`;
                }

                return '';
            },
            set: debounce((val) => {
                if (val) {
                    const [day, month, year] = val.split('.');
                    const newDate = new Date(props.modelValue);
                    if (day) {
                        newDate.setDate(day);
                    }

                    if (month) {
                        newDate.setMonth(month - 1);
                    }

                    if (year) {
                        newDate.setFullYear(year);
                        ctx.emit('update:modelValue', newDate);
                        ctx.emit('update', newDate);
                    }
                } else {
                    ctx.emit('update:modelValue', null);
                    ctx.emit('update', null);
                }
            }, 500),
        });

        const selectedDate = (e) => {
            ctx.emit('update:modelValue', e);
            ctx.emit('update', e);
        };

        const hide = (event) => {
            if (!isActive.value) {
                return;
            }

            if (!root.value.contains(event.target)) {
                isActive.value = false;
            }

            ctx.emit('blur', props.modelValue);
        };

        onMounted(() => {
            outsideSub(hide);
        });

        onUnmounted(() => {
            outsideUnsub(hide);
        });

        return {
            isActive,
            hide,
            root,
            privateDate,
            selectedDate,
        };
    },
};
</script>

<style scoped>
.datepicker__container {
    position: relative;
}

.datepicker__calendar {
    position: absolute;
    bottom: -10px;
    right: 0;
    transform: translateY(100%);
    z-index: 20;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
}

.date__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    height: 100%;
    cursor: pointer;
    width: 3rem;
}
</style>
