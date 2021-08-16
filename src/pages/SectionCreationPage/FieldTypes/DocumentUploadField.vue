<template>
    <div class="modal-win" id="modal-add-field-not-required">
        <div class="form-wrap">
            <form @submit="submitHandle">
                <div class="form-wrap__input-wrap form-group">
                    <label
                    ><span class="form-wrap__input-title">Заголовок</span
                    ><input
                        v-model="titleValue"
                        class="form-wrap__input form-control"
                        :class="{'is-invalid': titleError && titleMeta.dirty, 'is-valid': !titleError && titleMeta.dirty }"
                        name="title"
                        type="text"
                        placeholder="Заголовок поля"
                    />
                    </label>
                </div>
                <div class="form-wrap__input-wrap form-group">
                   <span class="form-wrap__input-title">Допустимые форматы</span>
                    <div class="row">
                        <label
                            v-for='item in allExtensions'
                            :key='item'
                            class="form-wrap__label-modal">
                            <input
                                v-model='fileExtensionsValue'
                                class="btn-check btn-check-modal"
                                type="checkbox"
                                :value="item"/>
                            <span class="btn btn-info btn-info-modal btn-sm">{{item}}</span>
                        </label>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-wrap__input-wrap form-group">
                        <label>
                            <span class="form-wrap__input-title">Максимальный размер файла</span>
                            <input
                                v-model='maxFileSizeValue'
                                class="form-wrap__input form-control input-max-size"
                                :class="{'is-invalid': maxFileSizeError && maxFileSizeMeta.dirty, 'is-valid': !maxFileSizeError && maxFileSizeMeta.dirty }"
                                name="maxFileSize"
                                type="text"
                                placeholder="mb"
                            />
                        </label>
                    </div>
                    <!-- +e.input-wrap-->
                </div>
                <label class="custom-input form-check">
                    <input
                    v-model="requiredValue"
                    class="custom-input__input form-check-input"
                    name="checkbox"
                    type="checkbox"
                     />
                    <span class="custom-input__text form-check-label">Обязательное поле</span>
                </label>
                <div
                    v-if="!formMeta.valid && formMeta.dirty"
                    class="text-center text-danger mb-3">
                    Заполните все поля чтобы создать поле
                </div>
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
import {ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import {useField, useForm} from 'vee-validate';
import * as yup from 'yup';

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
            max: 200,
        });

        const allExtensions =  ['doc', 'xls', 'xlsx', 'jpg', 'pdf', 'fig', 'pptx',];

        const schema = yup.object({
            title: yup.string().required(),
            fileExtensions: yup.array().min(1),
            maxFileSize: yup.string().required(),
            required: yup.boolean(),
        });

        const {
            handleSubmit,
            setValues,
            meta: formMeta
        } = useForm({validationSchema: schema});

        const {value: titleValue, errorMessage: titleError, meta: titleMeta} = useField('title');
        const {value: fileExtensionsValue, errorMessage: fileExtensionsError, meta: fileExtensionsMeta}
            = useField(
            'fileExtensions',
            undefined,
            {initialValue: []}
        );
        const {value: maxFileSizeValue, errorMessage: maxFileSizeError, meta: maxFileSizeMeta} = useField('maxFileSize');
        const {value: requiredValue} = useField('required');

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                required: !!props.fieldToChange.required,
                fileExtensions: props.fieldToChange.type.extensions,
                maxFileSize: props.fieldToChange.type?.max,
            });
        }

        const addNewField = ({title, fileExtensions, maxFileSize, required }) => {
            const field = {
                ...newField.value,
                title,
                required: !!required,
                type: {
                    ...fieldType.value,
                    extensions: fileExtensions,
                    max: maxFileSize
                }
            }
            emit('addNewField', field);
        };

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        return {
            allExtensions,
            titleValue,
            titleError,
            titleMeta,
            fileExtensionsValue,
            fileExtensionsError,
            fileExtensionsMeta,
            maxFileSizeValue,
            maxFileSizeError,
            maxFileSizeMeta,
            requiredValue,
            submitHandle,
            formMeta,
        };
    },
};
</script>

<style scoped></style>
