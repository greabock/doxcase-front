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
    emits: ['addNewField'],
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
                name: 'Boolean',
            },
        };
        const newField = ref({...initField, ...props.fieldToChange});
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
