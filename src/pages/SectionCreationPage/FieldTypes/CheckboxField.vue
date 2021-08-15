<template>
    <div id="modal-add-field-not-required">
        <div class="form-wrap">
            <form @submit="submitHandle">
            <div class="form-wrap__input-wrap form-group">
                <label
                ><span class="form-wrap__input-title">Заголовок</span
                ><input
                    v-model="chbTitle"
                    name="chbTitle"
                    class="form-wrap__input form-control"
                    :class="{'is-invalid': errorMessage && metachbTitle.dirty, 'is-valid': !errorMessage && metachbTitle.dirty }"
                    type="text"
                    placeholder="Заголовок поля"
                />
                </label>
            </div>
            <!-- +e.input-wrap-->

            <label class="custom-input form-check"
            ><input
                v-model="chbIsPresentInCard"
                class="custom-input__input form-check-input"
                name="chbIsPresentInCard"
                type="checkbox"
            /><span class="custom-input__text form-check-label">Отображать на карточке материала</span>
            </label>
                <div
                    v-if="!formMeta.valid && formMeta.dirty"
                    class="text-center text-danger mb-3">Заполните все поля чтобы создать поле
                </div>
                <button
                    v-if="!formMeta.valid"
                    type="submit"
                    class="btn btn-primary w-100"
                >
                    {{!!fieldToChange?.type ? 'Сохранить' : 'Добавить'}}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import {useForm, useField} from 'vee-validate'
import * as yup from 'yup';
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
            type: Object,
            default: () => {}
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

        const schema = yup.object({
            chbTitle: yup.string().required(),
            chbIsPresentInCard: yup.boolean()
        });

        const {handleSubmit, meta: formMeta, setValues} = useForm({validationSchema: schema});

        const {value: chbTitle, errorMessage, meta: metachbTitle} = useField('chbTitle');
        const {value: chbIsPresentInCard} = useField('chbIsPresentInCard');

        if (props.fieldToChange.type) {
            setValues({
                chbTitle: props.fieldToChange.title,
                chbIsPresentInCard: !!props.fieldToChange.is_present_in_card
            });
        }

        const addNewField = ({chbTitle, chbIsPresentInCard}) => {
            emit('addNewField', {
                    ...newField.value,
                    title: chbTitle,
                    is_present_in_card: chbIsPresentInCard,
                }
            );
        };

        const submitHandle = handleSubmit((values) => {
            addNewField(values);
        });

        return {
            chbTitle,
            chbIsPresentInCard,
            formMeta,
            submitHandle,
            newField,
            addNewField,
            errorMessage,
            metachbTitle,
        };
    },
};
</script>

<style scoped>
</style>
