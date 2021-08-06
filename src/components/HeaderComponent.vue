<template>
    <div class="topLine section" id="topLine">
        <div class="container-fluid">
            <div class="row">
                <div class="col-auto">
                    <router-link to="/" class="topLine__link-back">
                        <svg class="icon icon-arrow-left">
                            <use xlink:href="img/svg/sprite.svg#arrow-left"></use>
                        </svg>
                    </router-link>
                </div>
                <div class="col-auto d-lg-none">
                    <div class="topLine__toggle-wrap">
                        <div class="toggle-menu-mobile toggle-menu-mobile--js"><span></span></div>
                    </div>
                </div>
                <div class="col-lg-auto col text-center">
                    <router-link to="/">
                        <div class="d-sm-none">
                            <logo-icon-small iconWidth="82" iconHeight="26" iconColor="#252f6c"></logo-icon-small>
                        </div>
                        <div class="d-none d-sm-block">
                            <logo-icon iconWidth="354" iconHeight="157" iconColor="#252f6c"></logo-icon>
                        </div>
                    </router-link>
                </div>
                <div class="col-lg order-lg-0 order-last">
                    <div class="menu-mobile menu-mobile--js d-lg-block">
                        <div class="row">
                            <div class="col-lg-auto">
                                <div class="menu-mobile__btn-wrap">
                                    <router-link to="/" class="topLine__btn btn-info" v-if="user?.role === 'admin'">
                                        <svg class="icon icon-setting">
                                            <use xlink:href="img/svg/sprite.svg#setting"></use>
                                        </svg>
                                        <span class="topLine__btn-text d-lg-none">Настроить разделы</span>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-lg">
                                <ul class="menu">
                                    <li><router-link to="/">О сервисе</router-link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <router-link
                        to="/chapter-creation"
                        class="topLine__btn topLine__btn--plus btn-primary"
                    ></router-link>
                </div>
                <div class="col-auto">
                    <div class="avatar-block bg-wrap"><img class="img-bg" :src="userAvatar" alt="" /></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {computed, onMounted} from 'vue';
import {useStore} from 'vuex';
import LogoIcon from '@/assets/LogoIcon';
import LogoIconSmall from '../assets/LogoIconSmall';

export default {
    components: {
        LogoIcon,
        LogoIconSmall,
    },
    setup() {
        const store = useStore();

        onMounted(async () => {
            if (store.state.user.user === null) {
                await store.dispatch('user/fetchUserData');
            }
        });

        return {
            user: computed(() => store.getters['user/getUser']),
            userAvatar: computed(() => store.getters['user/getUserAvatar']),
        };
    },
};
</script>
