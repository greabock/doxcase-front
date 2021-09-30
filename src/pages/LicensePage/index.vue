<template>
    <div class="main-wrapper">
        <!-- start sLogin-->
        <div
            class='container arrow-left-cont'>
            <div class='row'>
                <div class='col'>
                    <div
                        @click="goToLoginPage"
                        class='arrow-container'
                    >
                        <img src='/img/svg/arrow_left.svg' alt='На страницу авторизации'>
                    </div>
                </div>
            </div>
        </div>
        <div class="sLogin section" id="sLogin">
            <div class="form-wrap">
                <logo-icon iconWidth="354" iconHeight="157" iconColor="#fff"></logo-icon>
                <div class="key-text">
                    Для начала работы с продуктом
                    введите лицензионный ключ
                </div>
                <key-form>
                </key-form>
            </div>
        </div>
    </div>
</template>
<script>
import {useRouter} from 'vue-router';
import * as yup from 'yup';
import LogoIcon from '@/assets/LogoIcon';
import KeyForm from '@/pages/LicensePage/KeyForm';

export default {
    name: 'AuthPage',
    components: {
        LogoIcon,
        KeyForm
    },
    setup() {

        const router = useRouter();
        const schema = yup.object().shape({
            email: yup.string().required('Введите email'),
            password: yup.string().required('Введите пароль'),
        });

        const goToLoginPage = () => {
            router.push('/auth');
        }

        return {
            goToLoginPage,
            schema,
        };
    },
};
</script>
<style>
.arrow-left-cont {
    position: relative;
    height: 0;
}
.arrow-container {
    position: absolute;
    cursor: pointer;
    top: 50px;
    left: 50px;
    z-index: 10;
}
.key-text {
    text-align: center;
    color: #fff;
    margin-bottom: 5rem;
}
</style>
