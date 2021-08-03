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
                    <button class="btn btn-primary w-100" :disabled="loading">
                        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                        <span>Login</span>
                    </button>
                </Form>
                <button class="btn btn-outline-white w-100">Войти с помощью Azure</button>
            </div>
        </div>
        <!-- end sLogin-->
    </div>
    <!--  start modals-->
    <div class="modal-win" id="modal-call" style="display: none">
        <div class="form-wrap">
            <form>
                <div class="text-center">
                    <div class="form-wrap__title form-data h3 ttu">Обратный звонок</div>
                    <p class="after-headline">
                        Заполните заявку и&nbsp;мы&nbsp;с&nbsp;Вами свяжемся в&nbsp;течение 15&nbsp;минут
                    </p>
                </div>
                <div class="form-wrap__input-wrap form-group">
                    <input
                        class="form-wrap__input form-control"
                        name="text"
                        type="text"
                        placeholder="Ваше Имя"
                        required="required"
                    />
                </div>
                <!-- +e.input-wrap-->
                <button class="form-wrap__btn btn" type="submit"></button>
                <div class="form-wrap__policy">
                    <label class="custom-input form-check"
                        ><input
                            class="custom-input__input form-check-input"
                            name="checkbox"
                            type="checkbox"
                            checked="checked"
                        /><small class="custom-input__text text-secondary"
                            >Согласен на обработку и хранение моих персональных данных в соответствии с условиями</small
                        >
                    </label>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import {Form, Field, ErrorMessage} from 'vee-validate';
import * as yup from 'yup';
import {useAuth} from '@/hooks/useAuth';
import LogoIcon from '@/assets/LogoIcon';

export default {
    name: 'AuthPage',
    components: {
        Form,
        Field,
        ErrorMessage,
        LogoIcon,
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
.error-feedback {
    display: block;
    padding-top: 5px;
    color: #00d600;
}
</style>
