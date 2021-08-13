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
                <label><span class="form-wrap__input-title">Выберите готовый список</span>
                    <select
                        v-model='selectedEnumId'
                        class="form-wrap__input form-select"
                    >
                        <option
                            v-for="enumItem in allEnums"
                            :key='enumItem?.id'
                            :value="enumItem?.id">{{ enumItem?.title }}
                        </option>
                    </select>
                </label>
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
            <label class="custom-input form-check">
                <input
                    v-model="multiSelect"
                    class="custom-input__input form-check-input"
                    name="checkbox"
                    type="checkbox"
                />
                <span class="custom-input__text form-check-label">Множественный выбор</span>
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
        allEnums: {
            type: Array
        },
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
        const multiSelect = ref(!!props.fieldToChange.type?.of?.of);
        console.log(props.fieldToChange.type?.to);
        const selectedEnumId = ref(props.fieldToChange.type?.of?.of || props.fieldToChange.type?.of || props.allEnums[0].id);

        const addNewField = () => {
            console.log(selectedEnumId.value);
            let typeOfField;
            if (multiSelect.value) {
                typeOfField = {
                    name: 'List',
                    of: {
                        name: 'Enum',
                        of: selectedEnumId.value
                    }
                }
            } else {
                typeOfField = {
                    name: 'Enum',
                    of: selectedEnumId.value
                }
            }
            const field = {
                ...newField.value,
                type: typeOfField
            }
            emit('addNewField', field);
        };

        return {
            newField,
            addNewField,
            multiSelect,
            selectedEnumId,
        };
    },
};
</script>

