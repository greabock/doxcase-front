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
                        :class="{'is-invalid': titleError && titleMeta.dirty, 'is-valid': !titleError && titleMeta.dirty }"
                        name="text"
                        type="text"
                        placeholder="Заголовок поля"
                    />
                    </label>
                </div>
            <!-- Вариант списка-->
            <div class="form-wrap__input-title">Вариант списка</div>
            <div class="input-group-column">

                <div
                    v-for='(optionString, i) in selectOptionsArray'
                    :key='optionString'
                    class="input-group-column__input-wrap form-group">
                    <input class="input-group-column__input form-control"
                           name="text" type="text"
                           placeholder="Введите вариант"
                           v-model='selectOptionsArray[i].value'
                    />
                    <div
                        @click='removeOption(i)'
                        class="btn-edit-sm btn-danger">
                        <svg class="icon icon-close ">
                            <use xlink:href="/img/svg/sprite.svg#close"></use>
                        </svg>
                    </div>
                </div>

                <div
                    @click='addOption'
                    class="btn-add">
                    <div class="btn-add__plus">
                    </div>
                    <div class="btn-add__text">Добавить вариант
                    </div>
                </div>
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
                <div
                    v-if="!formMeta.valid && formMeta.dirty"
                    class="text-center text-danger mb-3">Заполните все поля чтобы создать поле
                </div>
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
            type: {
                name: 'Select',
                of: [],
            },
        };
        const newField = ref({...initField, ...props.fieldToChange});

        const selectOptionsArray = ref(props.fieldToChange.type?.of ?
            props.fieldToChange.type?.of.map(item => ({value: item})) :
            [{value: ''}, {value: ''}, {value: ''}]
        );

        const removeOption = (idx) => {
            selectOptionsArray.value = [
                ...selectOptionsArray.value.slice(0, idx),
                ...selectOptionsArray.value.slice(idx +1)
            ];
        }
        const addOption = () => {
            selectOptionsArray.value = [...selectOptionsArray.value, {value: ''}];
        }

        const schema = yup.object({
            title: yup.string().required(),
            is_present_in_card: yup.boolean(),
            required: yup.boolean()
        });

        const {handleSubmit, setValues, meta: formMeta} = useForm({
            validationSchema: schema
        });

        const {value: titleValue, errorMessage: titleError, meta: titleMeta} = useField('title');
        const {value: requiredValue} = useField('required');
        const {value: is_present_in_cardValue} = useField('is_present_in_card');

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                required: !!props.fieldToChange.required,
                is_present_in_card: props.fieldToChange.is_present_in_card,
            });
        }

        const addNewField = ({title, required, is_present_in_card}) => {
            const options = selectOptionsArray.value.map(({value}) => value);
            emit('addNewField', {
                ...newField.value,
                title,
                required: !!required,
                is_present_in_card: !!is_present_in_card,
                type: {
                    name:'Select',
                    of: options
                }
            });
        };

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        return {
            selectOptionsArray,
            removeOption,
            addOption,

            formMeta,
            titleValue,
            titleError,
            titleMeta,
            requiredValue,
            is_present_in_cardValue,
            submitHandle,
        };
    },
};
</script>

<style scoped></style>
