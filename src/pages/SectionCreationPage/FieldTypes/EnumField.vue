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
                            v-for="enumItem in enumsArr"
                            :key='enumItem?.id'
                            :value="enumItem?.id">{{ enumItem?.title }}</option>
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
        <button @click.prevent="addNewField" class="btn btn-primary w-100" type="submit">Добавить</button>
    </div>
</template>

<script>
import {ref, toRefs, onMounted} from 'vue';
import {v4 as uuidv4} from 'uuid';
import enumService from '@/services/enums.service';

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
        const multiSelect = ref(false);
        const enumsArr = ref([]);
        const selectedEnumId = ref({});

        onMounted( async () => {
           try {
               enumsArr.value = await enumService.getEnums();
               if (enumsArr.value.length) {
                   selectedEnumId.value = enumsArr.value[0].id;
               }
           } catch(e) {
                console.log(e);
           }
        });

        const addNewField = () => {
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
            enumsArr,
            selectedEnumId,
        };
    },
};
</script>

<style scoped></style>
