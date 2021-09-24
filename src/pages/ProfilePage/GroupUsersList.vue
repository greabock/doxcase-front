<template>
    <div
        v-if="currentGroup?.users"
    >
        <div class="users-group-title-search">
            <div
                class="h3 mb-3 users-group-group-title"
            >{{currentGroup?.name}}
            </div>
            <div class="search-block">
                <div class="search-block__input-wrap form-group">
                    <input
                        v-model="searchUsersValue"
                        class="search-block__input form-control"
                        name="text"
                        type="text"
                        placeholder="Поиск"
                    />
                </div>
                <!-- +e.input-wrap-->
                <button class="search-block__btn" @click.stop.prevent type="submit">
                    <svg class="icon icon-search">
                        <use xlink:href="/img/svg/sprite.svg#search"></use>
                    </svg>
                </button>
            </div>
        </div>
        <div
            class="users-list-fom-wrapper sSections__col col-lg-auto col-md"
            id="users-group-list"
        >
            <template
                v-for='user in filteredSortedGroupUsers'
                :key='user.id'
            >
                <label
                    v-show="user.show"
                    class="groups-users-list__item custom-input form-check"
                ><input
                    class="custom-input__input form-check-input"
                    type="checkbox"
                    :value="user"
                    v-model="updatedGroupUsers"
                /><span class="custom-input__text form-check-label"
                >{{ user.name }}</span
                >
                </label>
            </template>
            <template
                v-for='user in filteredSortedUngroupUsers'
                :key='user.id'
            >
                <label
                    v-show="user.show"
                    class="groups-users-list__item custom-input form-check"
                ><input
                    class="custom-input__input form-check-input"
                    type="checkbox"
                    :value="user"
                    v-model="updatedGroupUsers"
                /><span class="custom-input__text form-check-label"
                >{{ user.name }}</span
                >
                </label>
            </template>
        </div>
        <div class="sAddDocs__footer user-groups-footer-buttons">
            <div class="container-fluid d-flex">
                <VButton class="btn-save" @click="updateGroup"> Сохранить изменения</VButton>
                <VButton class="ms-2" outline @click="cancelUpdate"> Отмена </VButton>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, watch, computed, onMounted, onUnmounted} from 'vue';
import VButton from '@/ui/VButton';
import groupService from '@/services/group.service';

const defineUngroupUsers = (allUsers, groupUsers) => {
    if (groupUsers && groupUsers.length > 0) {
        const excludeIds = groupUsers.map(user => user.id)
        return allUsers.filter((user) => !excludeIds.includes(user.id))
    }
    return allUsers;
}

export default {
    emits: ['updateGroup', 'cancelUpdate'],
    components: {
        VButton
    },
    props: {
        allUsers: {
            type: Array,
            default: () => []
        },
        propGroup: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, {emit}) {

        const currentGroup = ref({...props.propGroup});
        const groupUsersList = ref([...props.propGroup.users]);
        const updatedGroupUsers = ref([...props.propGroup.users]);
        const ungroupUsersList = ref([...defineUngroupUsers(props.allUsers, groupUsersList.value)]);
        const searchUsersValue = ref('');

        watch(() => props.propGroup, (newVal) => {
            currentGroup.value = newVal;
            groupUsersList.value = newVal.users;
            updatedGroupUsers.value = newVal.users;
            ungroupUsersList.value = defineUngroupUsers(props.allUsers, newVal.users);
        })

        const filteredSortedGroupUsers = computed(() => {
            return groupUsersList.value
                .map((user) => {
                    user.show = user.show = user.name.toLowerCase().includes(searchUsersValue.value.toLowerCase());
                    return user;
                })
                .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 )
        })

        const filteredSortedUngroupUsers = computed(() => {
            return ungroupUsersList.value
                .map(user => {
                    user.show = user.show = user.name.toLowerCase().includes(searchUsersValue.value.toLowerCase());
                    return user;
                })
                .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 )
        })

        const updateGroup = async () => {
            const updatedGroup = {
                ...currentGroup.value,
                users: updatedGroupUsers.value.map(user => {
                    delete user.show;
                    return user;
                })
            }
            try {
                await groupService.updateGroup(updatedGroup);
                emit('updateGroup', updatedGroup);
            } catch(e) {
                console.log(e);
            }
        }

        const cancelUpdate = () => {
            emit('cancelUpdate');
        }

        const listHeightHandle = () => {

            const myDiv = document.querySelector('#users-group-list');
            const topLineHeight = document.querySelector('.topLine').scrollHeight;
            const headerHeight = document.querySelector('.sCabinetMain__head').scrollHeight;
            const navTabsHeight = document.querySelector('.nav.nav-tabs').scrollHeight;
            const groupsButtonsHeight = document.querySelector('.groups-users-buttons').scrollHeight;
            const groupsAddHeight = document.querySelector('.groups-users-add-button').scrollHeight;
            const groupsTitleSearchHeight = document.querySelector('.users-group-title-search').scrollHeight;
            const groupsFooterButtonsHeight = document.querySelector('.user-groups-footer-buttons').scrollHeight;
            const footerHeight = document.querySelector('.footer').scrollHeight;

            const restHeight = window.innerHeight - topLineHeight - headerHeight - navTabsHeight - groupsButtonsHeight - groupsAddHeight -
                groupsTitleSearchHeight - groupsFooterButtonsHeight - footerHeight + (-130);

            if (restHeight < 390) {
                myDiv.style.height = '390px';
            } else {
                myDiv.style.height = restHeight + 'px';
            }
        };

        onMounted(() => {
            window.addEventListener('resize', listHeightHandle);
            listHeightHandle();
        });
        onUnmounted(() => {
            window.removeEventListener('resize', listHeightHandle);
        })

        return {
            groupUsersList,
            filteredSortedGroupUsers,
            filteredSortedUngroupUsers,
            searchUsersValue,
            currentGroup,
            ungroupUsersList,
            updateGroup,
            cancelUpdate,
            updatedGroupUsers,
        };
    },
};
</script>

<style scoped>
INPUT::placeholder {
    color: #d6d6d6;
}
.search-block {
    margin-bottom: 20px;
}
.sAddDocs__footer {
    margin-bottom:-25px;
    margin-left: -32px;
    padding-left: 15px;
}
.search-block {
    position: relative;
}
.sAddDocs__footer {
    position: absolute;
    bottom: 33px;
}
</style>
