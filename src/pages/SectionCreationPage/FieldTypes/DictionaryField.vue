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
                        name="title"
                        type="text"
                        placeholder="Заголовок поля"
                    />
                    </label>
                </div>
                <!-- +e.input-wrap-->
                <div class="form-wrap__input-wrap form-group">
                    <label><span class="form-wrap__input-title">Выберите раздел</span></label>
                        <v-select
                            class="mb-3"
                            name="selectedObj"
                            v-model="selectedObjValue"
                            :options="sectionOptions"
                            bordered
                        >
                        </v-select>
                </div>

                <label class="custom-input form-check">
                    <input
                        v-model="requiredValue"
                        class="custom-input__input form-check-input"
                        name="required"
                        type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">Обязательное поле</span>
                </label>
                <label class="custom-input form-check">
                    <input
                        v-model="multiSelectValue"
                        class="custom-input__input form-check-input"
                        name="multiSelect"
                        type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">Множественный выбор</span>
                </label>
                <button
                    :disabled="!formMeta.valid"
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
import {computed, ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import {useField, useForm} from 'vee-validate';
import * as yup from 'yup';
import VSelect from '@/ui/VSelect';

export default {
    components: {VSelect},
    props: {
        allSections: {
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
            description: 'Выбрать',
            required: false,
            is_present_in_card: false,
            sort_index: props.fieldsArrLength,
            filter_sort_index: null,
        };

        const sectionOptions = computed(() => {
            return (props.allSections.filter(section => section.is_dictionary)
                                     .map(section => ({key: section.id, name: section.title})));
        })
        const newField = ref({...initField, ...props.fieldToChange});

        const defineSelectedObj = (field, allSections) => {
            if (field && field.type?.name === 'Dictionary') {
                const mySection = allSections.find(item => item.id === field.type?.of);
                return {
                    key: mySection.id,
                    name: mySection.title
                }
            }
            if (field && field.type?.name === 'List') {
                const mySection = allSections.find(item => item.id === field.type?.of?.of);
                return {
                    key: mySection.id,
                    name: mySection.title
                }
            }
            return undefined;
        };

        const schema = yup.object({
            title: yup.string().required(),
            selectedObj: yup.object().required(),
        });

        const {
            handleSubmit,
            setValues,
            meta: formMeta
        } = useForm({validationSchema: schema});

        const {value: titleValue, errorMessage: titleError, meta: titleMeta} = useField('title');
        const {value: selectedObjValue} = useField('selectedObj');
        const {value: requiredValue} = useField('required');
        const {value: multiSelectValue} = useField('multiSelect');

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                selectedObj: defineSelectedObj(props.fieldToChange, props.allSections),
                required: !!props.fieldToChange.required,
                multiSelect: !!props.fieldToChange?.type?.of?.of

            });
        }

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        const addNewField = ({title, selectedObj, required, multiSelect}) => {
            console.log(selectedObj);
            let typeOfField;
            if (multiSelect) {
                typeOfField = {
                    name: 'List',
                    of: {
                        name: 'Dictionary',
                        of: selectedObj.key
                    }
                }
            } else {
                typeOfField = {
                    name: 'Dictionary',
                    of: selectedObj.key
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

        return {
            sectionOptions,
            newField,
            addNewField,
            formMeta,
            titleValue,
            titleError,
            titleMeta,
            selectedObjValue,
            requiredValue,
            multiSelectValue,
            submitHandle,
        };
    },
};
</script>

<style scoped></style>
