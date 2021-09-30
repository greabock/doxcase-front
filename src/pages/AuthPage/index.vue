<template>
    <div class="main-wrapper">
        <div class="sLogin section" id="sLogin">
            <div class="form-wrap">
                <logo-icon iconWidth="354" iconHeight="157" iconColor="#fff"></logo-icon>

                    <login-form>
                    </login-form>

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
import VButton from '@/ui/VButton';
import LogoIcon from '@/assets/LogoIcon';
import azureService from '@/services/azure.service';
import LoginForm from '@/pages/AuthPage/LoginForm';

export default {
    name: 'AuthPage',
    components: {
        LogoIcon,
        VButton,
        LoginForm
    },
    setup() {

        const azureHandler = async() => {
          try {
            const res = await azureService.getAzure();
            window.location.href = (res.data.data.url);
          } catch(e) {
            console.log(e);
          }
        }

        return {
            azureHandler,
        };
    },
};
</script>
<style>

</style>
