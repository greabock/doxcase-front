<template>
    <div>
        <div class="fw-500 pb-3">{{ title }}</div>
        <div class="row">
            <div class="col-3 text-label">Начало периода</div>
            <div class="col">
                <VDatePicker v-model="dateFrom" @update="updateDates" size="20rem" placeholder="ДД.ММ.ГГГГ" />
            </div>
        </div>
        <div class="row">
            <div class="col-3 text-label">Окончание периода</div>
            <div class="col">
                <VDatePicker v-model="dateTo" @update="updateDates" size="20rem" placeholder="ДД.ММ.ГГГГ" />
            </div>
        </div>
    </div>
</template>

<script>
import {ref, watch} from 'vue';
import VDatePicker from '@/ui/VDatePicker';

export default {
    components: {VDatePicker},
    props: {
        title: String,
        value: Array,
    },
    setup(props, {emit}) {
        const dateFrom = ref();
        const dateTo = ref();

        const updateDates = () => {
            if (dateFrom.value && dateTo.value) {
                emit('update', [dateFrom.value, dateTo.value]);
            }
        };

        watch(
            () => props.value,
            () => {
                if (props.value.length == 2) {
                    dateFrom.value = props.value[0];
                    dateTo.value = props.value[1];
                } else {
                    dateFrom.value = null;
                    dateTo.value = null;
                }
            }
        );

        return {
            updateDates,
            dateFrom,
            dateTo,
        };
    },
};
</script>

<style scoped>
.data-values-cont {
    display: flex;
}
.mar-right-5 {
    margin-right: 5px;
}

.text-label {
    font-size: 12px;
}
</style>
