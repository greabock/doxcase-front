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
import Cookies from 'js-cookie';
import * as yup from 'yup';
import {useStore} from 'vuex';
import {computed, watch, onBeforeMount} from 'vue';
import {useRouter} from 'vue-router';

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
            schema,
        };
    },

    setup() {
        const store = useStore();
        const router = useRouter();
        const role = computed(() => store.state.auth.role);

        const handleLogin = ({login, password}) => {
            store.dispatch('auth/login', {login, password});
        };
        const loading = computed(() => store.state.auth.loading);
        const error = computed(() => store.state.auth.error);
        const logout = () => {
            store.dispatch('auth/logout');
        };
        onBeforeMount(() => {
            const role = Cookies.get('role');
            const token = Cookies.get('token');
            if (role && token) {
                router.push('/profile');
            }
        });
        watch(role, () => {
            if (role.value) {
                router.push('/profile');
            }
        });
        return {
            role,
            handleLogin,
            logout,
            loading,
            error,
        };
    },
};
</script>
<style>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
</style>
