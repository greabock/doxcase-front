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
            <!-- +e.input-wrap-->
            <div class="form-wrap__input-wrap form-group">
                <label
                ><span class="form-wrap__input-title">Краткое описание поля</span
                ><input
                    v-model="newField.description"
                    class="form-wrap__input form-control"
                    name="text"
                    type="text"
                    placeholder="Краткое описание поля"
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
                           :idx='i'
                    />
                    <div class="btn-edit-sm btn-danger">
                        <svg class="icon icon-close ">
                            <use xlink:href="img/svg/sprite.svg#close"></use>
                        </svg>
                    </div>
                </div>

                <div class="btn-add">
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
        <button @click.prevent="addNewField" class="btn btn-primary w-100" type="submit">Добавить</button>
    </div>
</template>

<script>
import {ref, toRefs} from 'vue';
import {v4 as uuidv4} from 'uuid';

export default {
    props: {
        fieldsArrLength: {
            type: Number,
            default: 0,
        },
        fieldToChange: {
            type: Object,
            default: null,
        },
    },
    setup(props, {emit}) {
        const {fieldToChange, fieldsArrLength} = toRefs(props);
        const newField = ref({
            id: fieldToChange?.id || uuidv4(), // Если новое поле, то генерится новый Id.
            title: fieldToChange?.title || '',
            description: fieldToChange?.description || '',
            required: fieldToChange?.required || false,
            is_present_in_card: fieldToChange?.is_present_in_card || false,
            sort_index: fieldToChange?.sort_index || fieldsArrLength,
            filter_sort_index: null,
            type: ref({
                name: 'Text',
                min: 1,
                max: fieldToChange?.max || 2000,
            }),
        });
        const selectOptionsArray = ref([{value: ''}, {value: ''}]);
        const onInput = (e) => {
            const elem = e.target;
            const idx = elem.getAttribute('idx');
            console.log(idx, e.target.value);
            selectOptionsArray.value[idx] = e.target.value;
        };
        const addNewField = () => {
            emit('addNewField', newField.value);
        };

        return {
            newField,
            addNewField,
            selectOptionsArray,
            onInput,
        };
    },
};
</script>

<style scoped></style>
