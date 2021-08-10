<template>
    <div v-for="field in fieldsArr" :key="field.id" class="sSectionMain__item">
        <div class="row">
            <div class="col-lg-auto col order-first">
                <div class="sSectionMain__count">1</div>
            </div>
            <div class="sSectionMain__col-title col-lg-auto">
                <div class="text-dark small">Заголовок</div>
                <div class="fw-500 text-primary">{{ field?.title }}</div>
            </div>
            <div class="sSectionMain__col-content col-lg">
                <div class="text-dark small">Содержание</div>
                <div class="sSectionMain__content">{{ field?.description }}</div>
            </div>
            <div class="sSectionMain__col-cut col-auto order-first order-lg-0">
                <div class="text-dark small d-none d-lg-block">Тип поля</div>
                <div class="sSectionMain__content">{{ field.type.name }}</div>
            </div>
            <div class="col-12 d-lg-none pb-3"></div>
            <div class="col-lg-auto">
                <div class="sSectionMain__btn-control">
                    <div class="btn-edit-sm btn-secondary">
                        <svg class="icon icon-edit">
                            <use xlink:href="img/svg/sprite.svg#edit"></use>
                        </svg>
                    </div>
                    <div @click="removeField(field)" class="btn-edit-sm btn-danger">
                        <svg class="icon icon-basket">
                            <use xlink:href="img/svg/sprite.svg#basket"></use>
                        </svg>
                    </div>
                    <div @click="sortFieldUp(field)" class="btn-edit-sm btn-secondary">
                        <svg class="icon icon-chevron-up text-primary">
                            <use xlink:href="img/svg/sprite.svg#chevron-up"></use>
                        </svg>
                    </div>
                    <div @click="sortFieldDown(field)" class="btn-edit-sm btn-secondary">
                        <svg class="icon icon-chevron-down text-primary">
                            <use xlink:href="img/svg/sprite.svg#chevron-down"></use>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        fieldsArr: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, {emit}) {
        const sortFieldUp = (item) => {
            emit('sort-field-up', item);
        };
        const sortFieldDown = (item) => {
            emit('sort-field-down', item);
        };
        const removeField = (item) => {
            emit('remove-field', item);
        };
        return {
            sortFieldUp,
            sortFieldDown,
            removeField,
        };
    },
};
</script>

<style scoped></style>
