<template>
    <div ref="root" class="datepicker__container">
        <VInput
            v-model="privateDate"
            @focus="focusInput"
            v-maska="'##.##.####'"
            :placeholder="placeholder"
            :error="error"
            :bordered="bordered"
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
            ref="calendar"
            :style="{
                width: size || 'auto',
                transform: calendarPositionStyle || 'none',
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
        bordered: Boolean,
        positionY: {
            type: String,
            default: 'auto',
        },
        offset: {
            type: String,
            default: '10px',
        }
    },
    setup(props, {emit}) {
        const root = ref(null);
        const isActive = ref(false);
        const calendar = ref(null);

        const position = ref({});
        const innerSize = ref({});
        const calendarSize = ref({});

        const setInnerSize = debounce(() => {
            if (props.positionY !== 'auto') {
                return;
            }

            innerSize.value = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
            };
        }, 100);

        const setCalendarSize = debounce(() => {
            if (calendar.value?.$el) {
                calendarSize.value = {
                    height: calendar.value?.$el.clientHeight,
                    width: calendar.value?.$el.clientWidth,
                };
            }
        }, 0);

        const setPosition = debounce(() => {
            if (props.positionY !== 'auto') {
                return;
            }
            const {bottom, top, left, right} = root.value.getBoundingClientRect();

            position.value = {
                bottom,
                top,
                left,
                right,
            };
        }, 100);

        onMounted(() => {
            setPosition();
            setInnerSize();
            window.addEventListener('scroll', setPosition);
            window.addEventListener('resize', setInnerSize);
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', setPosition);
            window.addEventListener('resize', setInnerSize);
        });

        const focusInput = () => {
            isActive.value = true;
            emit('focus');
            setPosition();
            setCalendarSize();
        };

        const calendarPositionStyle = computed(() => {
            const top = `translateY(calc(0% - ${props.offset} - ${root.value.clientHeight}px))`;
            const bot = `translateY(calc(100% + ${props.offset}))`;

            if (props.positionY == 'top') {
                return top
            }

            if (props.positionY == 'bottom') {
                return bot
            }

            if (props.positionY == 'auto') {
                if (position.value.bottom + calendarSize.value.height > innerSize.value.height) {
                    return top
                }
            }

            return bot
        });

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
                        emit('update:modelValue', newDate);
                        emit('update', newDate);
                    }
                } else {
                    emit('update:modelValue', null);
                    emit('update', null);
                }
            }, 500),
        });

        const selectedDate = (e) => {
            emit('update:modelValue', e);
            emit('update', e);
        };

        const hide = (event) => {
            if (!isActive.value) {
                return;
            }

            if (!root.value.contains(event.target)) {
                isActive.value = false;
            }

            emit('blur', props.modelValue);
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
            position,
            innerSize,
            calendarSize,
            calendarPositionStyle,
            focusInput,
            calendar,
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
    z-index: 20;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
    transition: 0.3s ease-in-out;
    right: 0;
    bottom: 0;
    transform: translateY(0%);
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
