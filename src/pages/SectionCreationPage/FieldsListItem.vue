<template>
    <div class="row">
        <div class="col-lg-auto col order-first">
            <div class="sSectionMain__count">{{idx}}</div>
        </div>
        <div class="sSectionMain__col-title col-lg-auto">
            <div class="text-dark small">Заголовок</div>
            <div class="fw-500 text-primary">
                <span
                    @click="changeField(field)"
                    style="cursor:pointer"
                >{{ fieldsViewModel?.title }}</span>
            </div>
        </div>
        <div class="sSectionMain__col-content col-lg">
            <div class="text-dark small">{{ fieldsViewModel?.content_title }}</div>
            <div class="sSectionMain__content">{{ fieldsViewModel?.description }}</div>
        </div>
        <div class="sSectionMain__col-cut col-auto order-first order-lg-0">
            <div class="text-dark small d-none d-lg-block">Тип поля</div>
            <div class="sSectionMain__content">{{ fieldsViewModel?.type_view }}</div>
        </div>
        <div class="col-12 d-lg-none pb-3"></div>
        <div class="col-lg-auto">
            <div class="sSectionMain__btn-control">
                <div
                    @click="changeField(field)"
                    class="btn-edit-sm btn-secondary">
                    <svg class="icon icon-edit">
                        <use xlink:href="/img/svg/sprite.svg#edit"></use>
                    </svg>
                </div>
                <div
                    @click="removeField(fieldsViewModel?.field)"
                     class="btn-edit-sm btn-danger"
                >
                    <svg class="icon icon-basket">
                        <use xlink:href="/img/svg/sprite.svg#basket"></use>
                    </svg>
                </div>
                <div
                    @click="sortFieldUp(fieldsViewModel?.field)"
                     class="btn-edit-sm btn-secondary">
                    <svg class="icon icon-chevron-up text-primary"
                    >
                        <use xlink:href="/img/svg/sprite.svg#chevron-up"></use>
                    </svg>
                </div>
                <div
                    @click="sortFieldDown(fieldsViewModel?.field)"
                    class="btn-edit-sm btn-secondary"
                >
                    <svg class="icon icon-chevron-down text-primary">
                        <use xlink:href="/img/svg/sprite.svg#chevron-down"></use>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, watch} from 'vue'
export default {
    props: {
        allEnums: {
            type: Array
        },
        allSections: {
            type: Array
        },
        field: {
            type: Object,
            default: () => {},
        },
        idx: {
            type: Number,
        }
    },
    emits: ['change-field', 'sort-field-up', 'sort-field-down', 'remove-field'],
    setup(props, {emit}) {
        watch(() => props.field, (newVal) => {
                fieldsViewModel.value = defineView(newVal);
        },
            {deep: true}
        );

        const defineView = (field) => {
            const {title, description, type} = field;
            switch (type.name) {
                case "String":
                    return {
                        field,
                        title: title,
                        description: description,
                        content_title: "Краткое описание поля",
                        type_view:  "Короткое текстовое поле",
                    };
                case "Text":
                    return {
                        field,
                        title,
                        description,
                        content_title: "Краткое описание поля",
                        type_view:  "Текстовое поле",
                    };
                case "Wiki":
                    return {
                        field,
                        title,
                        description: "",
                        content_title: "",
                        type_view:  "Wiki разметка",
                    };
                case "Boolean":
                    return {
                        field,
                        title,
                        description: "",
                        content_title: "",
                        type_view:  "Чекбокс",
                    };
                case "Date":
                    return {
                        field,
                        title,
                        description: "",
                        content_title: "",
                        type_view:  "Выбор даты",
                    };
                case "Select":
                    return {
                        field,
                        title,
                        description: type.of.map((item, i) => `${i + 1}. ${item}`).join(' '),
                        content_title: "Варианты списка",
                        type_view:  "Значения из списка",
                    };
                case "File":
                    return {
                        field,
                        title,
                        description: type.extensions.map((item, i) => `${i + 1}. ${item}`).join(' '),
                        content_title: "Допустимые форматы",
                        type_view:  "Загрузка вложений",
                    };
                case "Enum":
                    return {
                        field,
                        title,
                        description: props.allEnums.find((item) => item.id === props.field.type.of).title,
                        content_title: "Содержание",
                        type_view:  "Значения из справочника",
                    };
                case "Dictionary":
                    return {
                        field,
                        title,
                        description: props.allSections.find((item) => item.id === props.field.type.of).title,
                        content_title: "Содержание",
                        type_view:  "Значения из списка",
                    };

                case "List":
                    switch (type.of.name) {
                        case 'Enum':
                            return {
                                field,
                                title,
                                description: props.allEnums.find((item) => item.id === props.field.type.of.of).title,
                                content_title: "Содержание",
                                type_view:  "Значения из справочника",
                        };
                        case 'Dictionary':
                            return {
                                field,
                                title,
                                description: props.allSections.find((item) => item.id === props.field.type.of.of).title,
                                content_title: "Содержание",
                                type_view:  "Значения из списка",
                        };
                        case 'Select':
                            return {
                                field,
                                title,
                                description: type.of.of.map((item, i) => `${i + 1}. ${item}`).join(' '),
                                content_title: "Содержание",
                                type_view:  "Значения из выпадающего списка",
                            };
                    }
                }
            }

        const fieldsViewModel = ref(defineView(props.field));

        const sortFieldUp = (item) => {
            emit('sort-field-up', item);
        };
        const sortFieldDown = (item) => {
            emit('sort-field-down', item);
        };
        const removeField = (item) => {
            emit('remove-field', item);
        };
        const changeField = (item) => {
            emit('change-field', item);
        }

        return {
            fieldsViewModel,
            sortFieldUp,
            sortFieldDown,
            removeField,
            defineView,
            changeField,
        };
    },
};
</script>

<style scoped>
@media (min-width: 991px) {
    .sSectionMain__col-title {
        width: 25%;
    }
    .sSectionMain__col-content {
        width: 40%;
    }
    .sSectionMain__col-cut {
        width: 25%
    }
}
</style>
