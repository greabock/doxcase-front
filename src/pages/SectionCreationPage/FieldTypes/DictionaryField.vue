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
                <label><span class="form-wrap__input-title">Выберите раздел</span>
                    <select
                        v-model='selectedSectionId'
                        class="form-wrap__input form-select"
                    >
                        <option
                            v-for="sectionItem in sectionsArr"
                            :key='sectionItem?.id'
                            :value="sectionItem?.id">{{ sectionItem?.title }}</option>
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
import {ref, onMounted} from 'vue';
import {v4 as uuidv4} from 'uuid';
import sectionsService from '@/services/sections.service';

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

        const multiSelect = ref(!!props.fieldToChange?.type?.of?.of);
        const sectionsArr = ref([]);
        const selectedSectionId = ref({});

        onMounted( async () => {
            try {
                sectionsArr.value = await sectionsService.getSections();
                if (sectionsArr.value.length) {
                    let idx = 0;
                    if (props.fieldToChange.type?.of?.of) {
                        idx = sectionsArr.value.findIndex(item => item.id === props.fieldToChange.type?.of?.of);
                    } else if (props.fieldToChange.type?.of) {
                        idx = sectionsArr.value.findIndex(item => item.id === props.fieldToChange.type?.of);
                    }
                    selectedSectionId.value = sectionsArr.value[idx].id;
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
                        name: 'Dictionary',
                        of: selectedSectionId.value
                    }
                }
            } else {
                typeOfField = {
                    name: 'Dictionary',
                    of: selectedSectionId.value
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
            sectionsArr,
            selectedSectionId,
        };
    },
};
</script>

<style scoped></style>
