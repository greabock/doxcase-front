<template>
    <div class="cr-calendar">
        <header class="cr-calendar__header">
            <slot name="prevYear">
                <button class="cr-calendar__arrow" @click.prevent="previousYear">&lt;&lt;</button>
            </slot>
            <slot name="prevMonth">
                <button class="cr-calendar__arrow" @click.prevent="previousMonth">&lt;</button>
            </slot>
            <span class="cr-calendar__month-year">
                <slot :date="currDateCursor">
                    {{ dateYear }}
                </slot>
            </span>
            <slot name="nextMonth">
                <button class="cr-calendar__arrow" @click.prevent="nextMonth">&gt;</button>
            </slot>
            <slot name="nextYear">
                <button class="cr-calendar__arrow" @click.prevent="nextYear">&gt;&gt;</button>
            </slot>
        </header>
        <div class="cr-calendar__headings">
            <span class="cr-calendar__weekday" v-for="weekDay in weekDays" :key="weekDay">
                {{ weekDay }}
            </span>
        </div>
        <span
            v-for="(day, index) in dates"
            class="cr-calendar__day"
            :class="[
                {'cr-today': day.isToday},
                {'cr-current-month': day.isCurrentMonth},
                {'cr-selected': day.isSelected},
                {'cr-disable': day.isMin || day.isMax},
                !displayDaysOtherMonth && {'cr-hide': !day.isCurrentMonth},
            ]"
            :key="index"
            @click.prevent="() => !(day.isMin || day.isMax) && setSelectedDate(day)"
        >
            {{ formatDateToDay(day.date) }}
        </span>
    </div>
</template>

<script>
import {
    setMonth,
    setDay,
    addMonths,
    getMonth,
    isSameMonth,
    isSameDay,
    isToday,
    lastDayOfMonth,
    startOfMonth,
    eachDayOfInterval,
    addYears,
    startOfWeek,
    endOfWeek,
} from 'date-fns';
import {formatWithOptions} from 'date-fns/fp';
import {ru} from 'date-fns/locale';

const DAYS_OF_WEEK = 7;

export default {
    data: () => ({
        currDateCursor: null,
    }),
    created() {
        this.currDateCursor = this.modelValue || new Date();
    },
    props: {
        modelValue: [Date, String],
        displayDaysOtherMonth: {
            type: Boolean,
            default: false,
        },
        locale: {
            type: Object,
            default: ru,
        },
        firstDayWeek: {
            type: Number,
            default: 1,
            validator: (i) => typeof i === 'number' && Number.isInteger(i) && i >= 0 && i <= 6,
        },
        weekdayFormat: {
            type: String,
            default: 'EEEEEE',
        },
        yearLabelFormat: {
            type: String,
            default: 'LLLL yyyy',
        },
        dayFormat: {
            type: String,
            default: 'd',
        },
        min: Date,
        max: Date,
    },
    computed: {
        dateYear() {
            return formatWithOptions({locale: this.locale}, this.yearLabelFormat, this.currDateCursor);
        },
        weekDays() {
            const initial = this.firstDayWeek;
            const dayFormat = formatWithOptions({locale: this.locale}, this.weekdayFormat);
            return [...Array(DAYS_OF_WEEK)]
                .map((_, i) => (initial + i) % DAYS_OF_WEEK)
                .map((v) =>
                    setDay(new Date(), v, {
                        weekStartsOn: this.firstDayWeek,
                    })
                )
                .map(dayFormat);
        },
        currentMonth() {
            return this.currDateCursor.getMonth();
        },
        dates() {
            const cursorDate = this.currDateCursor;
            const startDateOfMonth = startOfMonth(cursorDate);
            const endDateOfMonth = lastDayOfMonth(cursorDate);

            const startDate = startOfWeek(startDateOfMonth, {
                weekStartsOn: this.firstDayWeek,
            });

            const endDate = endOfWeek(endDateOfMonth, {
                weekStartsOn: this.firstDayWeek,
            });

            return eachDayOfInterval({start: startDate, end: endDate}).map((date) => ({
                date,
                isCurrentMonth: isSameMonth(cursorDate, date),
                isToday: isToday(date),
                isSelected: isSameDay(new Date(this.modelValue), date),
                isMin: this.min && date < this.min,
                isMax: this.max && date > this.max,
            }));
        },
    },
    methods: {
        nextMonth() {
            this.currDateCursor = addMonths(this.currDateCursor, 1);
            this.$emit('nextMonth', this.currDateCursor);
        },
        previousMonth() {
            this.currDateCursor = addMonths(this.currDateCursor, -1);
            this.$emit('prevMonth', this.currDateCursor);
        },
        nextYear() {
            this.currDateCursor = addYears(this.currDateCursor, 1);
            this.$emit('nextYear', this.currDateCursor);
        },
        previousYear() {
            this.currDateCursor = addYears(this.currDateCursor, -1);
            this.$emit('prevYear', this.currDateCursor);
        },
        setSelectedDate(day) {
            if (!day.isCurrentMonth) {
                const selectedMonth = getMonth(day.date);
                this.currDateCursor = setMonth(this.currDateCursor, selectedMonth);
            }

            this.$emit('selected', day.date);
            this.$emit('update:modelValue', day.date);
        },
        formatDateToDay(val) {
            return formatWithOptions({locale: this.locale}, this.dayFormat, val);
        },
    },
    watch: {
        modelValue(date) {
            this.currDateCursor = date ? new Date(date) : new Date();
        },
    },
};
</script>

<style lang="scss" scoped>
.cr-calendar {
    --bg-color: #fff;
    --light-color: #f0f0f0;
    --main-color: #6e6e6e;
    --additional-color: #1d47ce;
    --day-color: #000000;
    background-color: var(--bg-color);
    border-radius: 3px;
    display: flex;
    flex-flow: row wrap;
    padding: 1.5rem;
    box-sizing: border-box;
    background: #fff;
}
.cr-calendar__header {
    flex: 1 1 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 0.25rem;
    min-height: 2rem;
    align-items: center;
    color: var(--main-color);
}
.cr-calendar__arrow {
    display: flex;
    border: none;
    padding: 0.25rem 0.5rem;
    background: #fff;
    color: var(--main-color);
    transition: color 0.2s;
    height: 100%;
    flex: 0 0 10%;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.cr-calendar__month-year {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: row wrap;
    flex: 1 1 auto;
    text-transform: capitalize;
}
.cr-calendar__arrow:hover {
    background: var(--light-color);
}
.cr-calendar__headings {
    display: flex;
    flex: 1 1 100%;
    flex-flow: row nowrap;
    justify-content: space-around;
    padding: 0.5rem 0;
    font-weight: 400;
    font-size: 1rem;
    color: var(--main-color);
    text-transform: capitalize;
}
.cr-calendar__weekday:nth-child(-n + 5) {
    color: var(--gray);
}
.cr-calendar__day {
    display: flex;
    flex: 0 0 auto;
    max-width: calc(100% / 7);
    min-width: calc(100% / 7);
    min-height: 2rem;
    border: none;
    background: #fff;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    padding: 0;
    color: var(--main-color);
    transition: background 0.2s;
    font-size: 1rem;
    cursor: pointer;
}
.cr-current-month {
    color: var(--day-color);
}
.cr-today {
    color: var(--additional-color);
}
.cr-hide {
    visibility: hidden;
}
.cr-calendar__day:hover {
    background: var(--light-color);
}
.cr-selected {
    background: var(--additional-color);
    color: #fff;
}
.cr-calendar__year {
    border: none;
    display: inline;
    max-width: 4rem;
    font-size: inherit;
    text-align: center;
    color: var(--main-color);
}

.cr-disable:hover,
.cr-disable {
    background: #fff;
    color: var(--light-color);
    cursor: not-allowed;
}
</style>
