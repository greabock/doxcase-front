<template>
    <div ref="root" class="datepicker__container">
        <VInput
            classInput="period-from"
            v-model="privateDate.from"
            @focus="isActiveFrom = true"
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
        <VInput
            classInput="period-to"
            v-model="privateDate.to"
            @focus="isActiveTo = true"
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
        <VCalendar @selected="selectedDate" v-model="date.from" v-if="isActiveFrom" class="datepicker__calendar" />
        <VCalendar @selected="selectedDate" v-model="date.to" v-if="isActiveTo" class="datepicker__calendar" />
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

const getDate = (d) => {
    const day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
                    const month = d.getMonth() + 1;
                    const monthFormat = month > 9 ? month : '0' + month;
                    const year = d.getFullYear();

                    return `${day}.${monthFormat}.${year}`;
}

export default {
    components: {
        VInput,
        DateIcon,
        VCalendar,
    },
    directives: {maska},
    props: {
        modelValue: [Date, String, Object],
        placeholder: String,
        error: String,
    },
    setup(props, ctx) {
        const root = ref(null);
        const isActiveFrom = ref(false);
        const isActiveTo = ref(false);

        const date = ref(props.modelValue || {from: null, to: null});

        const privateDate = computed({
            get: () => {
                if (date.value) {
                    const from = date.value.from && new Date(date.value.from);
                    const to = date.value.to && new Date(date.value.to);

                    return {
                        from: getDate(from),
                        to: getDate(to),
                    }
                }

                return {
                        from: '',
                        to: '',
                    }
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
            if (!isActiveFrom.value && !isActiveTo.value) {
                return 
            }
            
            if (!root.value.contains(event.target)) {
                isActiveFrom.value = false;
                isActiveTo.value = false;
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
            isActiveFrom,
            isActiveTo,
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
    display: flex;
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

.datepicker__container >>> .period-from {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
}

.datepicker__container >>> .period-to {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    border-left: 0;
}
</style>
