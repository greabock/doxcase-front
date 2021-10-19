<template>
    <Form
        @submit="handleLogin"
        :validation-schema="schema"
    >
        <div class="form-wrap__input-wrap form-group">
            <Field
                @input="skipError"
                name="email"
                type="text"
                class="form-wrap__input form-control"
                placeholder="Email" />
            <ErrorMessage name="email" class="error-feedback" />
        </div>

        <div class="form-wrap__input-wrap form-group">
            <Field
                @input="skipError"
                name="password"
                type="password"
                class="form-wrap__input form-control"
                placeholder="Пароль"
            />
            <ErrorMessage name="password" class="error-feedback" />
        </div>

        <v-button :disabled="loading" class="w-100">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Войти</span>
        </v-button>
        <div
            v-if="error"
            class="form-error-wrapper error-feedback">Неверный E-mail или пароль
        </div>
    </Form>
</template>

<script>
import {ref} from 'vue';
import VButton from '@/ui/VButton';
import {Form, Field, ErrorMessage} from 'vee-validate';
import * as yup from 'yup';
import {useAuth} from '@/hooks/useAuth';

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
            email: yup.string().required('Введите email'),
            password: yup.string().required('Введите пароль'),
        });
        const {
            handleLogin,
            handleLogout,
            loading,
            error,
            authCheck,
            skipError,
        } = useAuth();

        return {
            schema,
            handleLogin,
            handleLogout,
            authCheck,
            loading,
            error,
            formError,
            skipError,
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