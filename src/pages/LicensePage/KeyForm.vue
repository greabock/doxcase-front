<template>
    <Form
        @submit="handleLicense"
        :validation-schema="schema"
    >
        <div class="form-wrap__input-wrap form-group">
            <Field
                @input='skipError'
                name="prodKey"
                type="text"
                class="form-wrap__input form-control"
                placeholder="Введите ключ" />
            <ErrorMessage name="prodKey" class="error-feedback" />
        </div>
        <v-button :disabled="loading" class="w-100">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Активировать</span>
        </v-button>
        <div
            v-if="error"
            class="form-error-wrapper error-feedback">Неверный ключ
        </div>
    </Form>
</template>

<script>
import {ref} from 'vue';
import VButton from '@/ui/VButton';
import {Form, Field, ErrorMessage} from 'vee-validate';
import * as yup from 'yup';
import {useLicense} from '@/hooks/useLicense';

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
        VButton,
    },
    setup() {
        const formError = ref(false);
        const schema = yup.object().shape({
            prodKey: yup.string().required('Введите ключ'),
        });
        const {
            handleLicense,
            loading,
            error,
            skipError,
        } = useLicense();

        return {
            schema,
            handleLicense,
            loading,
            error,
            skipError,
            formError,
        };
    },
};
</script>

<style scoped>
.error-feedback {
    display: block;
    padding-top: 5px;
    color: #ff5454;
}
.form-error-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 5px;
}
</style>