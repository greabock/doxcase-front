<template>
    <div
        v-if="currentGroup?.users"
    >
        <div
            class="h3 mb-3"
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
        <div
            class="users-list-fom-wrapper sSections__col col-lg-auto col-md"
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
                    v-model="groupUsersList"
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
                    v-model="groupUsersList"
                /><span class="custom-input__text form-check-label"
                >{{ user.name }}</span
                >
                </label>
            </template>
        </div>
        <div class="sAddDocs__footer">
            <div class="container-fluid d-flex">
                <VButton class="btn-save" @click="updateGroup"> Сохранить изменения</VButton>
                <VButton class="ms-2" outline @click="() => {}"> Отмена </VButton>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, watch, computed} from 'vue';
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
    emits: ['updateGroup'],
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
        const ungroupUsersList = ref([...defineUngroupUsers(props.allUsers, props.propGroup.users)]);
        const searchUsersValue = ref('');

        watch(() => props.propGroup, (newVal) => {
            currentGroup.value = newVal;
            groupUsersList.value = newVal.users;
            ungroupUsersList.value = defineUngroupUsers(props.allUsers, currentGroup.value.users);
        }, {deep: true})

        const filteredSortedGroupUsers = computed(() => {
            if (currentGroup.value.users && currentGroup.value.users.length > 0) {
                return currentGroup.value.users
                    .map((user) => {
                        user.show = user.show = user.name.toLowerCase().includes(searchUsersValue.value.toLowerCase());
                        return user;
                    })
                    .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 )
            }
                return [];
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
                users: groupUsersList.value
            }
            try {
                await groupService.updateGroup(updatedGroup);
                emit('updateGroup', updatedGroup);
            } catch(e) {
                console.log(e);
            }
        }

        return {
            groupUsersList,
            filteredSortedGroupUsers,
            filteredSortedUngroupUsers,
            searchUsersValue,
            currentGroup,
            ungroupUsersList,
            updateGroup,
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
</style>
