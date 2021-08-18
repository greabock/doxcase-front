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
            <!-- Вариант списка-->
            <div
                class="form-wrap__input-title"
            >Вариант списка
            </div>
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
                    v-model="multiselectValue"
                    class="custom-input__input form-check-input"
                    name="checkbox"
                    type="checkbox"
                /><span class="custom-input__text form-check-label">Множественный выбор</span>
                </label>
                <button
                    :disabled="!formMeta.valid || !isOptionsValid"
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
import {ref, watch} from 'vue';
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

        const defineInitOptionsArray = (initField) => {
            switch (initField.type) {
                case undefined:
                    return  [{value: ''}];

                case 'Select':
                    return initField.type.of.map(item => ({value: item}));

                case 'List':
                    return initField.type.of.of.map(item => ({value: item}));
            }
        };
        const selectOptionsArray = ref(defineInitOptionsArray(props.fieldToChange));

        const removeOption = (idx) => {
            selectOptionsArray.value = [
                ...selectOptionsArray.value.slice(0, idx),
                ...selectOptionsArray.value.slice(idx +1)
            ];
        }
        const addOption = () => {
            selectOptionsArray.value = [...selectOptionsArray.value, {value: ''}];
        }
        const isOptionsValid = ref(true);
        watch(selectOptionsArray, (newVal) => {
            if (newVal.length === 0) {
               isOptionsValid.value = false;
            } else {
                isOptionsValid.value = newVal.reduce((isValid, item) => {
                    return isValid && !!item.value.length
                }, true);
            }
        }, {deep: true});

        const schema = yup.object({
            title: yup.string().required(),
            multiSelect: yup.boolean(),
            required: yup.boolean()
        });


        const {handleSubmit, setValues, meta: formMeta} = useForm({
            validationSchema: schema
        });

        const {value: titleValue} = useField('title');
        const {value: requiredValue} = useField('required');
        const {value: multiselectValue} = useField('multiSelect');

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                required: !!props.fieldToChange.required,
                multiSelect: !!props.fieldToChange.type?.of?.of
            });
        }

        const addNewField = ({title, required, multiSelect}) => {

            const options = selectOptionsArray.value.map(({value}) => value);

            let typeOfField;
            if (multiSelect) {
                typeOfField = {
                    name: 'List',
                    of: {
                        name: 'Select',
                        of: options
                    }
                }
            } else {
                typeOfField = {
                    name: 'Select',
                    of: options
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


        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        return {
            selectOptionsArray,
            removeOption,
            addOption,
            formMeta,
            titleValue,
            requiredValue,
            multiselectValue,
            submitHandle,
            isOptionsValid,
        };
    },
};
</script>

<style scoped>

</style>
