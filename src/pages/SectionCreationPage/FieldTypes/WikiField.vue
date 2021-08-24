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

            <label class="custom-input form-check"
            ><input
                v-model="requiredValue"
                class="custom-input__input form-check-input"
                name="required"
                type="checkbox"
            /><span class="custom-input__text form-check-label">Обязательное поле</span>
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
import {useForm, useField} from 'vee-validate'
import * as yup from 'yup';
import {ref} from 'vue';
import {v4 as uuidv4} from 'uuid';

export default {
    props: {
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
            description: 'Введите текст',
            required: false,
            is_present_in_card: false,
            sort_index: props.fieldsArrLength,
            filter_sort_index: null,
            type: {
                name: 'Wiki',
            },
        };
        const newField = ref({...initField, ...props.fieldToChange});

        const schema = yup.object({
            title: yup.string().required(),
            required: yup.boolean()
        });

        const {handleSubmit, setValues, meta: formMeta} = useForm({
            validationSchema: schema
        });
        const {value: titleValue} = useField('title');
        const {value: requiredValue} = useField('required');

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                required: !!props.fieldToChange.required
            });
        }

        const addNewField = ({title, required}) => {
            emit('addNewField', {
                ...newField.value,
                title,
                required: !!required,
            });
        };

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        return {
            newField,
            addNewField,
            formMeta,
            titleValue,
            requiredValue,
            submitHandle,
        };
    },
};
</script>

<style scoped></style>
