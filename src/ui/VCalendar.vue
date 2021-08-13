<template>
    <div class="cr-calendar">
        <header class="cr-calendar__header">
            <button class="cr-calendar__arrow" @click.prevent="previousYear">&lt;&lt;</button>
            <button class="cr-calendar__arrow" @click.prevent="previousMonth">&lt;</button>
            <span class="cr-calendar__month-year">
                <slot :date="currDateCursor">
                    {{ formatDate(currDateCursor) }}
                </slot>
            </span>
            <button class="cr-calendar__arrow" @click.prevent="nextMonth">&gt;</button>
            <button class="cr-calendar__arrow" @click.prevent="nextYear">&gt;&gt;</button>
        </header>
        <div class="cr-calendar__headings">
            <span class="cr-calendar__weekday" v-for="dayLabel in dayLabels" :key="dayLabel">
                {{ dayLabel }}
            </span>
        </div>
        <span
            v-for="(day, index) in dates"
            class="cr-calendar__day"
            :class="dayClassObj(day)"
            :key="index"
            @click.prevent="setSelectedDate(day)"
            >{{ formatDateToDay(day.date) }}</span
        >
    </div>
</template>

<script>
import {
    setMonth,
    addMonths,
    getMonth,
    isSameMonth,
    getDay,
    isSameDay,
    isToday,
    addDays,
    lastDayOfMonth,
    startOfMonth,
    eachDayOfInterval,
    format,
    addYears,
} from 'date-fns';

const DAYS_OF_WEEK = 7;

export default {
    data: () => ({
        currDateCursor: null,
    }),
    created() {
        this.currDateCursor = this.modelValue || new Date();
    },
    props: {
        modelValue: Date,
        firstDayWeek: {
            type: Number,
            default: 0,
        },
        dayLabels: {
            type: Array,
            default: () => ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
        },
    },
    computed: {
        currentMonth() {
            return this.currDateCursor.getMonth();
        },
        dates() {
            const cursorDate = this.currDateCursor;
            const startDateOfMonth = startOfMonth(cursorDate);
            const endDateOfMonth = lastDayOfMonth(cursorDate);
            const daysPrevMonth = getDay(startDateOfMonth - 1) + DAYS_OF_WEEK;
            const daysNeededForLastMonth = daysPrevMonth >= DAYS_OF_WEEK ? daysPrevMonth - DAYS_OF_WEEK : daysPrevMonth;
            const daysNextMonth = DAYS_OF_WEEK - getDay(endDateOfMonth);

            const daysNeededForNextMonth = daysNextMonth >= DAYS_OF_WEEK ? 0 : daysNextMonth;
            const startDate = addDays(startDateOfMonth, -daysNeededForLastMonth);
            const endDate = addDays(endDateOfMonth, daysNeededForNextMonth);

            return eachDayOfInterval({start: startDate, end: endDate}).map((date) => ({
                date,
                isCurrentMonth: isSameMonth(cursorDate, date),
                isToday: isToday(date),
                isSelected: isSameDay(this.modelValue, date),
            }));
        },
    },
    methods: {
        dayClassObj(day) {
            return {
                today: day.isToday,
                current: day.isCurrentMonth,
                hide: !day.isCurrentMonth,
                selected: day.isSelected,
            };
        },
        nextMonth() {
            this.currDateCursor = addMonths(this.currDateCursor, 1);
        },
        previousMonth() {
            this.currDateCursor = addMonths(this.currDateCursor, -1);
        },
        nextYear() {
            this.currDateCursor = addYears(this.currDateCursor, 1);
        },
        previousYear() {
            this.currDateCursor = addYears(this.currDateCursor, -1);
        },
        setSelectedDate(day) {
            // change calendar to correct month if they select previous or next month's days
            if (!day.isCurrentMonth) {
                const selectedMonth = getMonth(this.selectedDate);
                this.currDateCursor = setMonth(this.currDateCursor, selectedMonth);
            }

            this.$emit('selected', day.date);
            this.$emit('update:modelValue', day.date);
        },
        formatDateToDay(val) {
            return format(val, 'd');
        },
        formatDate(val) {
            return format(val, 'MMM yyyy');
        },
    },
    watch: {
        modelValue(date) {
                this.currDateCursor = date;

        }
    }
};
</script>

<style lang="scss" scoped>
.cr-calendar {
    --white: #fff;
    --light-gray: #f0f0f0;
    --main-color: #6e6e6e;
    --additional-color: #1d47ce;
    --main-gray: gray;
    background-color: var(--white);
    border-radius: 3px;
    display: flex;
    width: calc(100% - 0.25rem);
    flex-flow: row wrap;
    // padding: 0.5rem 0.25rem;
    padding: 1.5rem;
    box-sizing: border-box;
    // padding: 1rem;
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
    color: var(--main-gray);
    transition: color 0.2s;
    height: 100%;
    flex: 0 0 15%;
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
}
.cr-calendar__arrow:hover {
    background: var(--light-gray);
    // color: #000;
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
    font-weight: lighter;
    color: var(--main-gray);
    transition: background 0.2s;
    font-size: 1rem;
    cursor: pointer;
    //   border-top: 1px solid var(--light-gray);
}
.cr-calendar__day.current {
    color: #000;
}
.cr-calendar__day:hover {
    background: var(--light-gray);
}
.cr-calendar__day.selected {
    background: var(--additional-color);
    color: #fff;
}
.cr-calendar__year {
    border: none;
    display: inline;
    max-width: 4rem;
    font-size: inherit;
    text-align: center;
    // border-bottom: 1px solid var(--light-gray);
    color: var(--main-color);
}

.hide {
    visibility: hidden;
}
</style>
