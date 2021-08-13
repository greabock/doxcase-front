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
        };
        const newField = ref({...initField, ...props.fieldToChange});
        const fieldType = ref({
            name: 'File',
            max: props.fieldToChange.type?.max || 200,
        });
        const defaultExtensions =  [
            { name: 'doc', checked: false },
            { name: 'xls', checked: false },
            { name: 'xlsx', checked: false },
            { name: 'jpg', checked: false },
            { name: 'pdf', checked: false },
            { name: 'fig', checked: false },
            { name: 'pptx', checked: false},
        ];

        const checkExtension = (item, extArr) => {
            if (extArr.findIndex((extArrItem) => extArrItem === item.name) >= 0) {
                return {...item, checked: true}
            }
            return item;
        };

        // Поиск выбранных расширений у файлов, если поле уже создано.
        const fieldsExtensions = ref(   props.fieldToChange.type?.extensions ?
                defaultExtensions.map(item => checkExtension(item, props.fieldToChange.type?.extensions)) :
                defaultExtensions
           );


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
