<template>
    <div class="topLine section" id="topLine">
        <div class="container-fluid">
            <div class="row">

                <div class="col-auto d-lg-none">
                    <div class="topLine__toggle-wrap">
                        <div
                            @click='toggleMenuMobileActive'
                            class="toggle-menu-mobile toggle-menu-mobile--js"
                            :class="{'on': isMenuMobileActive}"
                        ><span></span></div>
                    </div>
                </div>
                <div class="col-lg-auto col text-center">
                    <template
                        v-if="$route.path === '/'"
                    >
                        <div
                            class="logo-div"
                            @click="changeAtFirst"
                        >
                            <div class="d-sm-none">
                                <logo-icon-small iconWidth="82" iconHeight="26" iconColor="#252f6c"></logo-icon-small>
                            </div>
                            <div class="d-none d-sm-block">
                                <logo-icon iconWidth="354" iconHeight="157" iconColor="#252f6c"></logo-icon>
                            </div>
                        </div>
                    </template>
                    <template
                        v-else
                    >
                        <router-link to="/">
                            <div class="d-sm-none">
                                <logo-icon-small iconWidth="82" iconHeight="26" iconColor="#252f6c"></logo-icon-small>
                            </div>
                            <div class="d-none d-sm-block">
                                <logo-icon iconWidth="354" iconHeight="157" iconColor="#252f6c"></logo-icon>
                            </div>
                        </router-link>
                    </template>

                </div>
                <div class="col-lg order-lg-0 order-last">
                    <div
                        class="menu-mobile menu-mobile--js d-lg-block"
                        :class="{'active': isMenuMobileActive}"
                    >
                        <div class="row">
                            <div class="col-lg-auto">
                                <div
                                    @click="toggleMenuMobileActive"
                                    class="menu-mobile__btn-wrap"
                                >
                                    <router-link to="/sections" class="topLine__btn btn-info" v-if="user?.role === 'admin'">
                                        <svg class="icon icon-setting">
                                            <use xlink:href="/img/svg/sprite.svg#setting"></use>
                                        </svg>
                                        <span class="topLine__btn-text d-lg-none">Настроить разделы</span>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-lg">
<!-- Section links in header -->

                                <top-menu
                                    v-if="sectionsInHeader?.length"
                                    :sectionsInHeader="sectionsInHeader"
                                    @toggleIsMobileActive="toggleMenuMobileActive"
                                ></top-menu>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="user?.role === 'admin' ||  user?.role === 'moderator'"
                    class="col-auto">
                    <router-link
                        to="/material-creation"
                        class="topLine__btn topLine__btn--plus btn-primary"
                    ></router-link>
                </div>
                <div class="col-auto">
                    <div class="avatar-block bg-wrap">
                        <router-link to="/profile">
                            <img class="img-bg" :src="user?.photo" alt="" />
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, computed, onMounted} from 'vue';
import {useStore} from 'vuex';
import LogoIcon from '@/assets/LogoIcon';
import LogoIconSmall from '@/assets/LogoIconSmall';
import TopMenu from '@/components/TopMenu';

export default {
    components: {
        LogoIcon,
        LogoIconSmall,
        TopMenu,
    },
    setup() {
        const store = useStore();
        const changeAtFirst = () => store.dispatch('search/increaseAtFirst');
        const sectionsInHeader = computed(() => {
            const sections = store.getters['sections/getSections'];
            if (sections?.length) {
                return sections.filter(item => item.is_navigation)
                    .sort((a, b) => a.sort_index - b.sort_index)
            }
            return []
        });

        const isMenuMobileActive = ref(false);
        const toggleMenuMobileActive = () => {
            isMenuMobileActive.value = !isMenuMobileActive.value;
        };

        onMounted(async () => {
             await store.dispatch('user/fetchUserData');
             await store.dispatch('sections/fetchSections');
        });

        return {
            user: computed(() => store.getters['user/getUser']),
            sectionsInHeader,
            toggleMenuMobileActive,
            isMenuMobileActive,
            changeAtFirst,
        };
    },
};
</script>

<style scoped>
.topLine {
    z-index: 1;
}
@media (max-width: 575px) {
    #topLine {
        padding-top: 10px;
        padding-bottom:10px;
    }
}
.logo-div {
    cursor:pointer;
}
.topLine__btn:hover .topLine__btn-text {
    color: #000 !important;
}
</style>
