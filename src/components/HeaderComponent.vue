<template>
    <key-alert
        :userRole="user?.role"
        :licenseInfo="licenseInfo"
    >
    </key-alert>
    <div
        class="topLine section"
        id="topLine"
        :class="{'z-index-10': isDropdownShow}"
    >
        <div class="container-fluid">
            <div class="row">

                <div class="col-auto d-lg-none">
                    <div class="topLine__toggle-wrap">
                        <div
                            @click='toggleMenuMobileActive'
                            class="toggle-menu-mobile toggle-menu-mobile--js"
                            :class="{'on': isMenuMobileActive}"
                        ><span>
                        </span>
                        </div>
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
                                <logo-icon-small iconWidth="354" iconHeight="157" iconColor="#252f6c"></logo-icon-small>
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
                                <logo-icon-small iconWidth="354" iconHeight="157" iconColor="#252f6c"></logo-icon-small>
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
                                    <router-link
                                        v-if="(user?.role === 'admin') && isEditAllowed"
                                        to="/sections" class="topLine__btn btn-info"
                                    >
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
                                    @updateIsDropdownShow="updateIsDropdownShow"
                                ></top-menu>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="(user?.role === 'admin' ||  user?.role === 'moderator') && isEditAllowed"
                    class="col-auto">
                    <router-link
                        :to="materialCreationLink"
                        class="topLine__btn topLine__btn--plus btn-primary"
                    ></router-link>
                </div>
                <div class="col-auto">
                    <div class="avatar-block bg-wrap">
                        <router-link to="/profile">
                            <img class="img-bg" :src="avatar" alt="" />
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useStore} from 'vuex';
import {useRoute, useRouter} from 'vue-router';
import LogoIconSmall from '@/assets/LogoIconSmall';
import TopMenu from '@/components/TopMenu';
import KeyAlert from '@/components/KeyAlert';
import licenseService from '@/services/license.service';
import {defineIsEditAllowed} from '@/utils/date.helpers';

export default {
    components: {
        LogoIconSmall,
        TopMenu,
        KeyAlert
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const changeAtFirst = () => store.dispatch('search/increaseAtFirst');
        const sectionsInHeader = computed(() => {
            const sections = store.getters['sections/getSections'];
            if (sections?.length) {
                return sections.filter(item => item.is_navigation)
                    .sort((a, b) => a.sort_index - b.sort_index)
            }
            return []
        });
        const isDropdownShow = ref(false);
        const updateIsDropdownShow = (bool) => {
            isDropdownShow.value = bool;
        }

        const materialCreationLink = computed(() => {
            const {id} = route.params;
            if (route.name === 'SectionSearchPage' && id) {
                return `/material-creation/${id}`;
            }
            return '/material-creation';
        })        

        const isMenuMobileActive = ref(false);
        const toggleMenuMobileActive = () => {
            isMenuMobileActive.value = !isMenuMobileActive.value;
        };

        const user = computed(() => store.getters['user/getUser']);
        const isEditAllowed = computed(() => {
            return store.getters['user/getIsEditAllowed']
        });

        const avatar = computed(() => {
                if (user.value?.photo !== null ) {
                return user.value?.photo;
                } else {
                    return '/img/@1x/avatar-2.png'
                }
            }
        );

        const licenseInfo = computed(() => store.getters['user/getLicenseInfo']);
        let updateLicenseInterval = null;

        onMounted(async () => {
            const license = await licenseService.getLicense();
            if (!license || !license.expires_at) {
                await router.push('/license');
            }
            store.commit('user/setLicense', license);
            store.commit('user/setIsEditAllowed', defineIsEditAllowed(license.expires_at, license.current_date));
             updateLicenseInterval = setInterval( () => {
                store.dispatch('user/fetchLicenseInfo');
             }, 1800000);
             await store.dispatch('user/fetchUserData');
             await store.dispatch('sections/fetchSections');
        });

        onUnmounted(async () => {
            await store.commit('sections/setSections', []);
            clearInterval(updateLicenseInterval);
        });

        return {
            materialCreationLink,
            user,
            avatar,
            sectionsInHeader,
            toggleMenuMobileActive,
            isMenuMobileActive,
            changeAtFirst,
            isDropdownShow,
            updateIsDropdownShow,
            licenseInfo,
            isEditAllowed,
        };
    },
};
</script>

<style scoped>
.topLine {
    z-index: 2;
    padding: 5px 0;
}
.logo-div {
    cursor:pointer;
}
.z-index-10 {
    z-index:10 !important;
}
@media (max-width: 974px) {
    .topLine {
        z-index: 10;
    }
}
@media (max-width: 575px) {
    .topLine {
        padding: 5px 0;
    }
}
</style>
