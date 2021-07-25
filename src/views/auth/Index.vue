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
                <div v-if="message" class="alert alert-danger" role="alert">
                    {{ message }}
                </div>
            </div>
        </Form>

        <div class="form-group">
            <button @click="logout" class="btn btn-danger btn-block" :disabled="loading">
                <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                <span>Logout</span>
            </button>
        </div>
    </div>
</template>
<script>
import {Form, Field, ErrorMessage} from 'vee-validate';
import AuthService from '../../services/auth.service.js';
import Cookies from 'js-cookie';
import * as yup from 'yup';

export default {
    name: 'Login',
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            login: yup.string().required('Введите логин'),
            password: yup.string().required('Введите пароль'),
        });

        return {
            loading: false,
            message: '',
            schema,
        };
    },
    computed: {
        userRole() {
            return this.$store.state.auth.role;
        },
    },
    created() {
        if (this.userRole) {
            this.$router.push('/profile');
        }
    },
    methods: {
        async handleLogin({login, password}) {
            this.loading = true;
            try {
                const token = await AuthService.getToken({login, password});
                Cookies.set('token', token);
                const userInfo = await AuthService.getUserInfo();
                console.log(userInfo);
                this.$store.dispatch('auth/setUserData', userInfo.data.data);
                this.$router.push('/profile');
            } catch (error) {
                this.loading = false;
                this.message =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
            }
        },
        logout() {
            this.$store.dispatch('auth/logout');
            Cookies.remove('token');
        },
    },
};
</script>
<style>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
</style>
