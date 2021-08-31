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
                    <div :style="{width: '170px'}" class="form-wrap__input-wrap form-group">
                        <label>
                            <span class="form-wrap__input-title">Максимальный размер файла</span>
                            <input
                                v-model='maxFileSizeValue'
                                class="form-wrap__input form-control input-max-size"
                                name="maxFileSize"
                                type="text"
                                placeholder=""
                            />
                            <span class="mb-placeholder"
                            >mb</span>
                        </label>
                    </div>
                    <!-- +e.input-wrap-->
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
            description: 'Выбрать',
            required: false,
            is_present_in_card: false,
            sort_index: props.fieldsArrLength,
            filter_sort_index: null,
        };
        const newField = ref({...initField, ...props.fieldToChange});

        const allExtensions =  ['doc', 'xls', 'xlsx', 'jpg', 'pdf', 'png', 'pptx',];

        const schema = yup.object({
            title: yup.string().required(),
            fileExtensions: yup.array().min(1),
            maxFileSize: yup.number().required().positive().integer(),
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
        const {value: maxFileSizeValue} = useField('maxFileSize');

        if (props.fieldToChange.type) {
            setValues({
                title: props.fieldToChange.title,
                fileExtensions: props.fieldToChange.type?.of?.extensions,
                maxFileSize: Number(props.fieldToChange.type?.of?.max) / 1024,
            });
        }

        const addNewField = ({title, fileExtensions, maxFileSize}) => {
            const field = {
                ...newField.value,
                title,
                type: {
                    name: 'List',
                    of: {
                        name: 'File',
                        max: Number(maxFileSize) * 1024,
                        extensions: fileExtensions
                    }
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
            submitHandle,
            formMeta,
        };
    },
};
</script>

<style scoped>
.mb-placeholder {
    display: block;
    position: relative;
    left: 135px;
    top: -39px;
    color: #d6d6d6;
    height: 0;
}
.input-max-size {
    text-align:left;
}
</style>
