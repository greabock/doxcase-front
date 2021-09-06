<template>
    <div class="main-wrapper">
        <!-- start sLogin-->
        <div class="sLogin section" id="sLogin">
            <div class="form-wrap">
                <logo-icon iconWidth="354" iconHeight="157" iconColor="#fff"></logo-icon>
                <Form @submit="handleLogin" :validation-schema="schema">
                    <div class="form-wrap__input-wrap form-group">
                        <Field name="login" type="text" class="form-wrap__input form-control" placeholder="Логин" />
                        <ErrorMessage name="login" class="error-feedback" />
                    </div>
                    <!-- +e.input-wrap-->
                    <div class="form-wrap__input-wrap form-group">
                        <Field
                            name="password"
                            type="password"
                            class="form-wrap__input form-control"
                            placeholder="Пароль"
                        />
                        <ErrorMessage name="password" class="error-feedback" />
                    </div>
                    <!-- +e.input-wrap-->
                    <v-button :disabled="loading" class="w-100">
                        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                        <span>Войти</span>
                    </v-button>
                </Form>
                <v-button
                    @click="azureHandler"
                    :outline=true
                    color="white"
                    class="w-100"
                > Войти с помощью Azure
                </v-button>
            </div>
        </div>
    </div>
</template>
<script>
import {onMounted} from 'vue';
import VButton from '@/ui/VButton';
import {Form, Field, ErrorMessage} from 'vee-validate';
import * as yup from 'yup';
import {useAuth} from '@/hooks/useAuth';
import LogoIcon from '@/assets/LogoIcon';
import azureService from '@/services/azure.service';
import {useRouter} from 'vue-router';

export default {
    name: 'AuthPage',
    components: {
        Form,
        Field,
        ErrorMessage,
        LogoIcon,
        VButton,
    },
    setup() {
        const schema = yup.object().shape({
            login: yup.string().required('Введите логин'),
            password: yup.string().required('Введите пароль'),
        });
        const {handleLogin, handleLogout, loading, error, authCheck, store} = useAuth();

        const router = useRouter();

        const azureHandler = async() => {
          try {
            const res = await azureService.getAzure();
            window.location.href = (res.data.data.url);
          } catch(e) {
            console.log(e);
          }
        }

        onMounted(async () => {
          const queryParams = router.currentRoute.value.query;
          if (Object.keys(queryParams).length !== 0) {
            try {
              const token = await azureService.postAzure(queryParams);
              localStorage.setItem('token', token);
              await store.dispatch('user/fetchUserData');
              const user = store.getters['user/getUser'];
              localStorage.setItem('role', user.role);
              await router.push('/');
            } catch (e) {
              console.log(e);
            }

          }
        })

        return {
            schema,
            handleLogin,
            handleLogout,
            authCheck,
            loading,
            error,
            azureHandler,
        };
    },
};
</script>
<style>
.error-feedback {
    display: block;
    padding-top: 5px;
    color: #00d600;
}
</style>
