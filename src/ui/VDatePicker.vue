<template>
    <div ref="root" class="datepicker__container">
        <VInput
            v-model="privateDate"
            @focus="isActive = true"
            v-maska="'##.##.####'"
            :placeholder="placeholder"
            :error="error"
            :bordered="true"
        >
            <template #right>
                <div @click="isActive = !isActive">
                    <div class="date__icon">
                        <DateIcon />
                    </div>
                </div>
            </template>
        </VInput>
        <VCalendar @selected="selectedDate" v-model="date" v-if="isActive" class="datepicker__calendar" />
    </div>
</template>

<script>
import {ref} from '@vue/reactivity';
import VCalendar from './VCalendar'
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
        modelValue: [Date, String],
        placeholder: String,
        error: String,
    },
    setup(props, ctx) {
        const root = ref(null);
        const isActive = ref(false);
        const date = ref(props.modelValue);

        const privateDate = computed({
            get: () => {
                if (date.value) {
                    const d = new Date(date.value);
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
                    const newDate = new Date(date.value);
                    if (day) {
                        newDate.setDate(day);
                    }

                    if (month) {
                        newDate.setMonth(month - 1);
                    }

                    if (year) {
                        newDate.setFullYear(year);
                        date.value = newDate;
                        ctx.emit('update:modelValue', newDate);
                    }
                } else {
                    date.value = null;

                    ctx.emit('update:modelValue', null);
                }
            }, 500),
        });

        const selectedDate = (e) => {
            date.value = e;
            ctx.emit('update:modelValue', e);
        };

        const hide = (event) => {
            if (!isActive.value) {
                return 
            }
            
            if (!root.value.contains(event.target)) {
                isActive.value = false;
            }

            ctx.emit('blur', date.value);
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
            date,
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
    left: 0;
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
