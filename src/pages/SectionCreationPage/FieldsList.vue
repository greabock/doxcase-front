<template>
    <div class="sSectionMain__item disabled">
        <div class="row">
            <div class="col-lg-auto col order-first">
                <div class="sSectionMain__count"></div>
            </div>
            <div class="sSectionMain__col-title col-lg-auto">
                <div class="text-dark small">Заголовок</div>
                <div class="fw-500 text-primary">{{config?.name}}</div>
            </div>
            <div class="sSectionMain__col-content col-lg">
                <div class="text-dark small">Содержание</div>
                <div class="sSectionMain__content">{{config?.description}}</div>
            </div>
            <div class="sSectionMain__col-cut col-auto order-first order-lg-0">
                <div class="text-dark small d-none d-lg-block">Тип поля</div>
                <div class="sSectionMain__content">Короткое текстовое поле</div>
            </div>
            <div class="col-12 d-lg-none pb-3"></div>
            <div class="col-lg-auto">
                 <div class="sSectionMain__btn-control">
                        <div
                            @click.stop="changeTitle"
                            class="btn-edit-sm btn-secondary">
                            <svg class="icon icon-edit">
                                <use xlink:href="/img/svg/sprite.svg#edit"></use>
                            </svg>
                        </div>
                    </div>
            </div>
        </div>
    </div>

    <div
        v-for="(field, i) in fieldsArr"
        :key="field?.id"
        class="sSectionMain__item"
    >
        <fields-list-item
            :idx="i + 1"
            :field="field"
            @sort-field-down="sortFieldDown"
            @sort-field-up="sortFieldUp"
            @remove-field="removeField"
            @change-field="changeField"
            :allEnums="allEnums"
            :allSections="allSections"
        >
        </fields-list-item>
    </div>
</template>

<script>
import FieldsListItem from '@/pages/SectionCreationPage/FieldsListItem';

export default {
    components: {FieldsListItem},
    props: {
        allEnums: {
          type: Array,
        },
        allSections: {
            type: Array,
        },
        fieldsArr: {
            type: Array,
            default: () => [],
        },
        config: {
            type: Object || undefined
        }
    },
    emits: ['change-field', 'sort-field-up', 'sort-field-down', 'remove-field', 'change-title'],
    setup(props, {emit}) {

        const changeTitle = () => {
            emit('change-title');
        }
        const changeField = (item) => {
            emit('change-field', item);
        }
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
            changeField,
            changeTitle,
        };
    },
};
</script>

<style scoped>
</style>
