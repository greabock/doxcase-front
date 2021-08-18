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
                        name="titleValue"
                        type="text"
                        placeholder="Заголовок поля"
                    />
                    </label>
                </div>
            <!-- +e.input-wrap-->

                <label class="custom-input form-check"
                ><input
                    v-model="is_present_in_cardValue"
                    class="custom-input__input form-check-input"
                    name="checkbox"
                    type="checkbox"
                /><span class="custom-input__text form-check-label">Отображать на карточке материала</span>
                </label>
<!--                <div-->
<!--                    v-if="!formMeta.valid && formMeta.dirty"-->
<!--                    class="text-center text-danger mb-3">Заполните все поля чтобы создать поле-->
<!--                </div>-->
                <button
                    :disabled="!formMeta.valid"
                    type="submit"
                    class="btn btn-primary w-100"
                >
                    {{!!fieldToChange?.type ? 'Сохранить' : 'Добавить'}}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import {useForm, useField} from 'vee-validate'
import * as yup from 'yup';
import {ref} from 'vue';
import {v4 as uuidv4} from 'uuid';


export default {
    emits: ['addNewField'],
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
            description: 'default',
            required: false,
            is_present_in_card: false,
            sort_index: props.fieldsArrLength,
            filter_sort_index: null,
            type: {
                name: 'Boolean',
            },
        };
        const newField = ref({...initField, ...props.fieldToChange});

        const schema = yup.object({
            title: yup.string().required(),
            is_present_in_card: yup.boolean()
        });

        const {handleSubmit, meta: formMeta, setValues} = useForm({validationSchema: schema});

        const {value: titleValue, errorMessage: titleError, meta: titleMeta} = useField('title');
        const {value: is_present_in_cardValue} = useField('is_present_in_card', undefined, {initialValue: false});
        //:class="{'is-invalid': titleError && titleMeta.dirty, 'is-valid': !titleError && titleMeta.dirty }" класс для валидации

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                is_present_in_card: !!props.fieldToChange.is_present_in_card
            });
        }

        const addNewField = ({title, is_present_in_card}) => {
            emit('addNewField', {
                    ...newField.value,
                    title,
                    is_present_in_card: !!is_present_in_card
                }
            );
        };

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        return {
            titleValue,
            titleError,
            titleMeta,
            is_present_in_cardValue,
            formMeta,
            submitHandle,
            newField,
            addNewField,
        };
    },
};
</script>

<style scoped>
</style>
