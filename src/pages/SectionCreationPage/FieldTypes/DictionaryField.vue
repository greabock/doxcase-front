<template>
    <div id="modal-add-field-not-required">
        <div class="form-wrap">
            <form @submit="submitHandle">
                <div class="form-wrap__input-wrap form-group">
                    <label
                    ><span class="form-wrap__input-title">Заголовок</span
                    ><input
                        v-model="titleValue"
                        class="form-wrap__input form-control"
                        name="title"
                        type="text"
                        placeholder="Заголовок поля"
                    />
                    </label>
                </div>
                <!-- +e.input-wrap-->
                <div class="form-wrap__input-wrap form-group">
                    <label><span class="form-wrap__input-title">Выберите раздел</span>
                        <select
                            v-model='selectedIdValue'
                            class="form-wrap__input form-select"
                            name="selectedId"
                        >
                            <option
                                v-for="sectionItem in filteredSections"
                                :key='sectionItem?.id'
                                :value="sectionItem?.id">{{ sectionItem?.title }}</option>
                        </select>
                    </label>
                </div>

                <label class="custom-input form-check">
                    <input
                        v-model="requiredValue"
                        class="custom-input__input form-check-input"
                        name="required"
                        type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">Обязательное поле</span>
                </label>
                <label class="custom-input form-check">
                    <input
                        v-model="multiSelectValue"
                        class="custom-input__input form-check-input"
                        name="multiSelect"
                        type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">Множественный выбор</span>
                </label>
                <button
                    :disabled="!formMeta.valid"
                    class="btn btn-primary w-100"
                    type="submit"
                >
                    {{!!fieldToChange?.type ? 'Сохранить' : 'Добавить'}}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import {useField, useForm} from 'vee-validate';
import * as yup from 'yup';

export default {
    props: {
        allSections: {
            type: Array
        },
        fieldsArrLength: {
            type: Number,
            default: 0,
        },
        fieldToChange: {
            type: Object
        },
    },
    setup(props, {emit}) {
        const initField = {
            id: uuidv4(),
            title: '',
            description: 'default',
            required: false,
            is_present_in_card: false,
            sort_index: props.fieldsArrLength,
            filter_sort_index: null,
        };

        const filteredSections = ref(props.allSections.filter(section => section.is_dictionary));
        const newField = ref({...initField, ...props.fieldToChange});

        const schema = yup.object({
            title: yup.string().required(),
            selectedId: yup.string().required(),
        });

        const {
            handleSubmit,
            setValues,
            meta: formMeta
        } = useForm({validationSchema: schema});

        const {value: titleValue, errorMessage: titleError, meta: titleMeta} = useField('title');
        const {value: selectedIdValue} = useField('selectedId');
        const {value: requiredValue} = useField('required');
        const {value: multiSelectValue} = useField('multiSelect');

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                selectedId: props.fieldToChange?.type?.of?.of || props.fieldToChange?.type?.of,
                required: !!props.fieldToChange.required,
                multiSelect: !!props.fieldToChange?.type?.of?.of

            });
        }

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        const addNewField = ({title, selectedId, required, multiSelect}) => {
            let typeOfField;
            if (multiSelect) {
                typeOfField = {
                    name: 'List',
                    of: {
                        name: 'Dictionary',
                        of: selectedId
                    }
                }
            } else {
                typeOfField = {
                    name: 'Dictionary',
                    of: selectedId
                }
            }
            const field = {
                ...newField.value,
                title,
                required: !!required,
                type: typeOfField
            }
            emit('addNewField', field);
        };

        return {
            filteredSections,
            newField,
            addNewField,
            formMeta,
            titleValue,
            titleError,
            titleMeta,
            selectedIdValue,
            requiredValue,
            multiSelectValue,
            submitHandle,
        };
    },
};
</script>

<style scoped></style>
