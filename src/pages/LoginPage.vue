<template>
    <div class="container">
        <Form @submit="handleLogin" :validation-schema="schema">
            <div class="form-group">
                <label for="username">Username</label>
                <Field id="username" name="username" type="text" class="form-control" />
                <ErrorMessage name="username" class="error-feedback" />
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
    </div>
</template>
<script>
import {Form, Field, ErrorMessage} from 'vee-validate';
import * as yup from 'yup';
export default {
    name: 'LoginPage',
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            login: yup.string().required('Введите логин!'),
            password: yup.string().required('Введите пароль'),
        });

        return {
            loading: false,
            message: '',
            schema,
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.role;
        },
    },
    created() {
        if (this.loggedIn) {
            this.$router.push('/profile');
        }
    },
    methods: {
        handleLogin(user) {
            this.loading = true;

            this.$store.dispatch('auth/login', user).then(
                () => {
                    this.$router.push('/profile');
                },
                (error) => {
                    this.loading = false;
                    this.message =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();
                }
            );
        },
    },
};
</script>
<style>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
</style>
