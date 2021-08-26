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
                    <label><span class="form-wrap__input-title">Выберите готовый список</span>
                        <v-select
                            class="mb-3"
                            name="selectedObj"
                            v-model="selectedObjValue"
                            :options="enumOptions"
                            bordered
                        >
                        </v-select>
                    </label>
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
import {ref, computed} from 'vue';
import {v4 as uuidv4} from 'uuid';
import {useField, useForm} from 'vee-validate';
import * as yup from 'yup';
import VSelect from '@/ui/VSelect';

export default {
    components: {VSelect},
    props: {
        allEnums: {
            type: Array,
            default: () => []
        },
        fieldsArrLength: {
            type: Number,
            default: 0,
        },
        fieldToChange: {
            type: Object,
            default: () => {}
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

        const enumOptions = computed(() => {
            return props.allEnums.map(enumItem => ({key: enumItem.id, name: enumItem.title}))
        })

        const schema = yup.object({
            title: yup.string().required(),
            selectedObj: yup.object().required(),
        });

        const newField = ref({...initField, ...props.fieldToChange});
        const {
            handleSubmit,
            setValues,
            meta: formMeta
        } = useForm({validationSchema: schema});

        const {value: titleValue} = useField('title');
        const {value: selectedObjValue} = useField('selectedObj');
        const {value: requiredValue} = useField('required');
        const {value: multiSelectValue} = useField('multiSelect');

        const defineSelectedObj = (field, allEnums) => {
            if (field && field.type?.name === 'Enum') {
                const myEnum = allEnums.find(item => item.id === field.type?.of);
                console.log('MyEnum enum', field.type.of, myEnum);
                return {
                    key: myEnum.id,
                    name: myEnum.title
                }
            }
            if (field && field.type?.name === 'List') {
                const myEnum = allEnums.find(item => item.id === field.type?.of?.of);
                console.log('MyEnum list', field.type.of.of, myEnum);
                return {
                    key: myEnum.id,
                    name: myEnum.title
                }
            }
            return undefined;
        };

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                selectedObj: defineSelectedObj(props.fieldToChange, props.allEnums),
                required: !!props.fieldToChange.required,
                multiSelect: !!props.fieldToChange?.type?.of?.of

            });
        }

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        const addNewField = ({title, selectedObj, required, multiSelect}) => {
            let typeOfField;
            if (multiSelect) {
                typeOfField = {
                    name: 'List',
                    of: {
                        name: 'Enum',
                        of: selectedObj.key
                    }
                }
            } else {
                typeOfField = {
                    name: 'Enum',
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
            newField,
            addNewField,
            formMeta,
            titleValue,
            selectedObjValue,
            requiredValue,
            multiSelectValue,
            submitHandle,
            enumOptions,
        };
    },
};
</script>

