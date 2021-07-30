<template>
    <div class="container">
        <Form @submit="handleLogin" :validation-schema="schema">
            <div class="form-group">
                <label for="login">Login</label>
                <Field id="login" name="login" type="text" class="form-control" />
                <ErrorMessage name="login" class="error-feedback" />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <Field id="password" name="password" type="password" class="form-control" />
                <ErrorMessage name="password" class="error-feedback" />
            </div>

            <div class="form-group">
                <button class="btn btn-primary btn-block" :disabled="loading">
                    <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                    <span>Login</span>
                </button>
            </div>
            <div class="form-group">
                <div v-if="error" class="alert alert-danger" role="alert">
                    {{ error }}
                </div>
            </div>
            <button @click="handleLogout" class="btn btn-danger btn-block" :disabled="loading">
                <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                <span>Logout</span>
            </button>
        </Form>
    </div>
</template>
<script>
import {Form, Field, ErrorMessage} from 'vee-validate';
import * as yup from 'yup';
import {useAuth} from '@/hooks/useAuth';

export default {
    name: 'AuthPage',
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    setup() {
        const schema = yup.object().shape({
            login: yup.string().required('Введите логин'),
            password: yup.string().required('Введите пароль'),
        });
        const {handleLogin, handleLogout, loading, error, authCheck} = useAuth();

        return {
            schema,
            handleLogin,
            handleLogout,
            authCheck,
            loading,
            error,
        };
    },
};
</script>
<style>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
</style>
