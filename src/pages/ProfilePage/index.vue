<template>
    <main class="main-block d-flex">
        <section class="sCabinet section py-0" id="sCabinet">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-aside col-lg-auto">
                        <user-profile-aside :user="user"></user-profile-aside>
                    </div>
                    <div class="col col--main">
                        <div
                            v-if="(user?.role === 'admin' || user?.role === 'moderator') && isEditAllowed"
                            class="sCabinetMain section"
                            id="sCabinetMain"
                        >
                            <div class="sCabinetMain__head">
                                <div class="h3">Редактирование</div>
                            </div>
                            <ul class="nav nav-tabs">
                                <li class="nav-item">
                                    <span
                                        @click.prevent="switchPageContent('enums')"
                                        class="nav-link"
                                        :class="{active: pageContent === 'enums'}"
                                        >Справочники
                                    </span>
                                </li>
                                <li v-if="(user?.role === 'admin') && isEditAllowed" class="nav-item">
                                    <span
                                        @click.prevent="switchPageContent('users')"
                                        class="nav-link"
                                        :class="{active: pageContent === 'users'}"
                                        >Пользователи
                                    </span>
                                </li>
                                <li v-if="(user?.role === 'admin') && isEditAllowed" class="nav-item">
                                    <span
                                        @click.prevent="switchPageContent('groups')"
                                        class="nav-link"
                                        :class="{active: pageContent === 'groups'}"
                                    >Управление группами
                                    </span>
                                </li>
                            </ul>
                                <div v-show="pageContent === 'enums'" class="sCabinetMain__body">
                                    <enums-tab></enums-tab>
                                </div>
                                <div v-if="(user?.role === 'admin') && isEditAllowed">
                                    <div v-if="pageContent === 'users'" class="sCabinetMain__body">
                                        <!-- Users block -->
                                        <users-tab
                                            :currentUser="user"
                                        ></users-tab>
                                    </div>
                                </div>

                            <div v-if="(user?.role === 'admin') && isEditAllowed">
                                <div v-if="pageContent === 'groups'"
                                     class="sCabinetMain__body groups-tab-cont-wrapper">
                                    <groups-tab></groups-tab>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import {ref, computed} from 'vue';
import EnumsTab from '@/pages/ProfilePage/EnumsTab';
import UsersTab from '@/pages/ProfilePage/UsersTab';
import {useStore} from 'vuex';
import {useAuth} from '@/hooks/useAuth';
import UserProfileAside from '@/pages/ProfilePage/UserProfileAside';
import GroupsTab from '@/pages/ProfilePage/GroupsTab';

export default {
    name: 'ProfilePage',
    components: {
        EnumsTab,
        UsersTab,
        UserProfileAside,
        GroupsTab,
    },
    setup() {
        const pageContent = ref('enums');
        const {handleLogout} = useAuth();
        const store = useStore();
        const user = computed(() => store.getters['user/getUser']);
        const isEditAllowed = computed(() => store.getters['user/getIsEditAllowed']);

        function switchPageContent(to) {
            pageContent.value = to;
        }

        return {
            handleLogout,
            pageContent,
            switchPageContent,
            user,
            isEditAllowed,
        };
    },
};
</script>

<style scoped>
.nav-link {
    cursor: pointer;
}

.nav-link.active {
    background: #f7f7f7;
    border-color: #f7f7f7; 
}
.groups-tab-cont-wrapper{
    padding-bottom: 120px;
}
</style>
