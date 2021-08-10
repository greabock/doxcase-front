<template>
    <div class="modal-win" id="modal-add-field-not-required">
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
            <!-- +e.input-wrap-->
            <div class="col-6">
                <div class="form-wrap__input-wrap form-group">
                    <label
                        ><span class="form-wrap__input-title">Максимум символов для поля</span
                        ><input
                            v-model="newField.type.max"
                            class="form-wrap__input form-control"
                            name="text"
                            type="text"
                            placeholder="Заполните поле"
                        />
                    </label>
                </div>
                <!-- +e.input-wrap-->
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
                name: 'String',
                min: 1,
                max: fieldToChange?.max || 255,
            }),
        });
        const addNewField = () => {
            emit('addNewField', newField.value);
        };

        return {
            newField,
            addNewField,
        };
    },
};
</script>

<style scoped></style>
