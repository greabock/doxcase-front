<template>
    <div id="modal-add-field-not-required">
        <div class="form-wrap">
            <div class="form-wrap__input-wrap form-group">
                <label
                ><span class="form-wrap__input-title">Заголовок</span
                ><input
                    v-model="newField.title"
                    class="form-wrap__input form-control"
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
                            <use xlink:href="img/svg/sprite.svg#close"></use>
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
                v-model="newField.required"
                class="custom-input__input form-check-input"
                name="checkbox"
                type="checkbox"
            /><span class="custom-input__text form-check-label">Обязательное поле</span>
            </label>
            <label class="custom-input form-check"
            ><input
                v-model="newField.is_present_in_card"
                class="custom-input__input form-check-input"
                name="checkbox"
                type="checkbox"
            /><span class="custom-input__text form-check-label">Отображать на карточке материала</span>
            </label>
        </div>
        <button
            @click.prevent="addNewField"
            class="btn btn-primary w-100"
            type="submit"
        >
            {{!!fieldToChange?.type ? 'Сохранить' : 'Добавить'}}
        </button>
    </div>
</template>

<script>
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
        const addNewField = () => {
            const options = selectOptionsArray.value.map(({value}) => value);
            const field = {...newField.value, type: {name:'Select', of: options}};
            emit('addNewField', field);
        };

        return {
            newField,
            addNewField,
            selectOptionsArray,
            removeOption,
            addOption,
        };
    },
};
</script>

<style scoped></style>
