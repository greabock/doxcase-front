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
                        name="text"
                        type="text"
                        placeholder="Заголовок поля"
                    />
                    </label>
                </div>
                <!-- +e.input-wrap-->
                <div class="form-wrap__input-wrap form-group">
                    <label
                    ><span class="form-wrap__input-title">Краткое описание поля</span
                    ><input
                        v-model="descriptionValue"
                        class="form-wrap__input form-control"
                        name="text"
                        type="text"
                        placeholder="Краткое описание поля"
                    />
                    </label>
                </div>
                <!-- +e.input-wrap-->
                <div class="col-6">
                    <div class="form-wrap__input-wrap form-group">
                        <label
                            ><span class="form-wrap__input-title">Максимум символов для поля</span
                            ><input
                                v-model="maxLengthValue"
                                class="form-wrap__input form-control"
                                name="maxLength"
                                type="text"
                                placeholder="Заполните поле"
                            />
                        </label>
                    </div>
                    <!-- +e.input-wrap-->
                </div>
                <label class="custom-input form-check"
                ><input
                    v-model="requiredValue"
                    class="custom-input__input form-check-input"
                    name="checkbox"
                    type="checkbox"
                /><span class="custom-input__text form-check-label">Обязательное поле</span>
                </label>
                <label class="custom-input form-check"
                ><input
                    v-model="is_present_in_cardValue"
                    class="custom-input__input form-check-input"
                    name="checkbox"
                    type="checkbox"
                /><span class="custom-input__text form-check-label">Отображать на карточке материала</span>
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
        fieldsArrLength: {
            type: Number,
            default: 0,
        },
        fieldToChange: {
            type: Object,
            default: () => {}
        },
    },
    setup(props, {emit}) {
        const initField = {
            id: uuidv4(),
            title: '',
            description: '',
            required: false,
            is_present_in_card: false,
            sort_index: props.fieldsArrLength,
            filter_sort_index: null,
            type: {
                name: 'Text',
                min: 1,
                max: 2000,
            },
         };
        const newField = ref({...initField, ...props.fieldToChange});

        const schema = yup.object({
            title: yup.string().required(),
            description: yup.string().required(),
            maxLength: yup.number().min(255).required(),
            is_present_in_card: yup.boolean(),
            required: yup.boolean()
        });

        const {handleSubmit, setValues, meta: formMeta} = useForm({
            validationSchema: schema
        });

        const {value: titleValue} = useField('title');
        const {value: descriptionValue} = useField('description');
        const {value: maxLengthValue} = useField('maxLength');
        const {value: requiredValue} = useField('required');
        const {value: is_present_in_cardValue} = useField('is_present_in_card');

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                description: props.fieldToChange.description,
                required: !!props.fieldToChange.required,
                maxLength: props.fieldToChange.type.max,
                is_present_in_card: props.fieldToChange.is_present_in_card,
            });
        }

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        const addNewField = ({title,description, required, is_present_in_card, maxLength}) => {

            emit('addNewField', {
                ...newField.value,
                title,
                description,
                required: !!required,
                is_present_in_card: !!is_present_in_card,
                type: {
                    ...newField.value.type,
                    max: maxLength
                }
            });
        };

        return {
            newField,
            addNewField,
            formMeta,
            titleValue,
            descriptionValue,
            maxLengthValue,
            requiredValue,
            is_present_in_cardValue,
            submitHandle,
        };
    },
};
</script>

<style scoped></style>

