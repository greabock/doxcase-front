<template>
    <div id="modal-add-field-not-required">
        <div class="form-wrap">
            <div class="h3 mb-4">Заголовок</div>

            <form @submit="submitHandle">
                <div class="form-wrap__input-wrap form-group">
                    <label
                    ><span class="form-wrap__input-title">Заголовок</span
                    ><input
                        v-model="nameValue"
                        class="form-wrap__input form-control"
                        name="text"
                        type="text"
                        placeholder="Заголовок поля"
                    />
                    </label>
                </div>
                <!-- +e.input-wrap-->
                <div class="form-wrap__input-wrap form-group">
                    <label>
                        <span class="form-wrap__input-title">
                            Содержание
                        </span >
                        <input
                            v-model="descriptionValue"
                            class="form-wrap__input form-control"

                            name="text"
                            type="text"
                            placeholder="Краткое описание поля"
                        />
                    </label>
                </div>
                <button
                    :disabled="!formMeta.valid"
                    class="btn btn-primary w-100"
                    type="submit"
                >
                    {{'Сохранить'}}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import {useField, useForm} from 'vee-validate';
import * as yup from 'yup';

export default {
    props: {
        config: {
            type: Object || undefined
        }
    },
    setup(props, {emit}) {

        const schema = yup.object({
            name: yup.string().required(),
            description: yup.string().required(),
        });

        const {handleSubmit, setValues, meta: formMeta} = useForm({
            validationSchema: schema
        });

        const {value: nameValue} = useField('name');
        const {value: descriptionValue} = useField('description');

        if (props.config && props.config.name && props.config.description) {
            setValues({
                name: props.config.name,
                description: props.config.description,
            });
        }

        const updateTitle = ({name, description}) => {
            emit('updateTitle', {
                name,
                description
            });
        };

        const submitHandle = handleSubmit((values) => {
            updateTitle(values);
        });

        return {
            updateTitle,
            formMeta,
            nameValue,
            descriptionValue,
            submitHandle,
        };
    },
};
</script>

<style scoped></style>
