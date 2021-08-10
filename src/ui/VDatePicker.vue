<template>
    <div ref="root" class="datepicker__container">
        <VInput v-model="privateDate" @focus="isActive = true" v-maska="'##.##.####'">
            <template #right>
                <div @click="isActive = !isActive">
                    <div class="date__icon">
                        <DateIcon />
                    </div>
                </div>
            </template>
        </VInput>
        <Datepicker @selected="selectedDate" v-model="date" v-if="isActive" class="datepicker__calendar" :inline="true">
            <template #belowDate> {{}} </template>
        </Datepicker>
    </div>
</template>

<script>
import {ref} from '@vue/reactivity';
import Datepicker from 'vuejs3-datepicker';
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
        Datepicker,
        VInput,
        DateIcon,
    },
    directives: {maska},
    props: {
        modelValue: {
            type: Date,
            default: new Date(),
        },
    },
    setup(props, ctx) {
        const root = ref(null);
        const isActive = ref(false);
        // console.log(props.modelValue);
        const date = ref(props.modelValue);

        const privateDate = computed({
            get: () => {
                const d = new Date(date.value);
                const day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
                const month = d.getMonth() + 1;
                const monthFormat = month > 9 ? month : '0' + month;
                const year = d.getFullYear();

                return `${day}.${monthFormat}.${year}`;
            },
            set: debounce((val) => {
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
            }, 500),
        });

        const selectedDate = (e) => {
            ctx.emit('update:modelValue', e);
        };

        const hide = (event) => {
            if (!root.value.contains(event.target)) {
                isActive.value = false;
            }
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
    bottom: 0;
    left: 0;
    transform: translateY(100%);
    z-index: 20;
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

.datepicker__calendar >>> .vuejs3-datepicker__calendar-topbar {
    background-color: #1d47ce;
}

.datepicker__calendar >>> .vuejs3-datepicker__calendar .cell.selected {
    background: #1d47ce;
}

.datepicker__calendar >>> .vuejs3-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover {
    border: 1px solid #1d47ce;
}
</style>
