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

            <div class="form-wrap__input-wrap form-group">
                <label><span class="form-wrap__input-title">Допустимые форматы</span>
                    <div class="row">

                        <label
                            v-for='item in fieldsExtensions'
                            :key='item.name'
                            class="form-wrap__label-modal">
                            <input
                                v-model='item.checked'
                                class="btn-check btn-check-modal"
                                type="checkbox"
                                name="btn"/>
                            <span class="btn btn-info btn-info-modal btn-sm">{{ item.name }}</span>
                        </label>

                    </div>
                </label>
            </div>

            <div class="col-6">
                <div class="form-wrap__input-wrap form-group">
                    <label>
                        <span class="form-wrap__input-title">Максимальный размер файла</span>
                        <input
                            v-model='fieldType.max'
                            class="form-wrap__input form-control input-max-size"
                            name="text" type="text"
                            placeholder="mb"
                        />
                    </label>
                </div>
                <!-- +e.input-wrap-->
            </div>

            <label class="custom-input form-check">
                <input
                v-model="newField.required"
                class="custom-input__input form-check-input"
                name="checkbox"
                type="checkbox"
                 />
                <span class="custom-input__text form-check-label">Обязательное поле</span>
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
            description: fieldToChange?.description || 'Default description',
            required: fieldToChange?.required || false,
            is_present_in_card: fieldToChange?.is_present_in_card || false,
            sort_index: fieldToChange?.sort_index || fieldsArrLength,
            filter_sort_index: null,
        });
        const fieldType = ref({
            name: 'File',
            max: 200,
        });
        const fieldsExtensions = ref(   [
            { name: 'doc', checked: false },
            { name: 'xls', checked: false },
            { name: 'xlsx', checked: false },
            { name: 'jpg', checked: false },
            { name: 'pdf', checked: false },
            { name: 'fig', checked: false },
            { name: 'pptx', checked: false},
        ]);

        const addNewField = () => {
            const field = {
                ...newField.value,
                type: {
                    ...fieldType.value,
                    extensions: fieldsExtensions.value
                        .filter(item => item.checked)
                        .map(item => item.name)
                }
            }
            emit('addNewField', field);
        };

        return {
            newField,
            addNewField,
            fieldType,
            fieldsExtensions,
        };
    },
};
</script>

<style scoped></style>
