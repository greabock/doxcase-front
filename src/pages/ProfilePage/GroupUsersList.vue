<template>
    <div
        v-if="currentGroup?.users"
    >
        <div
            class="h3 mb-3"
        >{{currentGroup?.name}}
        </div>
        <div class="search-block">
            <form>
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
            </form>
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
                <VButton class="btn-save" @click="() => {}"> Сохранить изменения</VButton>
                <VButton class="ms-2" outline @click="() => {}"> Отмена </VButton>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, watch, computed} from 'vue';
import VButton from '@/ui/VButton';

const defineUngroupUsers = (allUsers, groupUsers) => {
    if (groupUsers && groupUsers.length > 0) {
        const excludeIds = groupUsers.map(user => user.id)
        return allUsers.filter((user) => !excludeIds.includes(user.id))
    }
    return [];
}

export default {
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
    setup(props) {

        const currentGroup = ref({...props.propGroup});
        const groupUsersList = ref([...props.propGroup.users]);
        const ungroupUsersList = ref([...defineUngroupUsers(props.allUsers, props.propGroup.users)]);
        const searchUsersValue = ref('');

        watch(() => props.propGroup, (newVal) => {
            currentGroup.value = newVal;
            groupUsersList.value = newVal.users;
            ungroupUsersList.value = defineUngroupUsers(props.allUsers, currentGroup.value.users);
        })

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



        // const filteredMixedUsers = computed(() => {
        //     let sortedGroupUsers = [];
        //     let sortedUngroupUsers = [];
        //
        //     if (currentGroup.value && currentGroup.value.users && currentGroup.value.users.length > 0) {
        //         sortedGroupUsers = currentGroup.value.users
        //             .map(user => ({...user, is: true}))
        //             .sort((a, b) => (a.name > b.name)? 1 : -1)
        //     }
        //
        //     if (props.allUsers.length > 0) {
        //
        //         if (sortedGroupUsers.length > 0) {
        //
        //             const sortedGroupIds = sortedGroupUsers.map(user => user.id) // Массив Id-шников из Списка пользователей
        //             sortedUngroupUsers = [...props.allUsers]
        //                 .filter((user) => !sortedGroupIds.includes(user.id))
        //                 .map((user) => ({...user, is: false}))
        //                 .sort((a, b) => (a.name > b.name) ? 1 : -1 );
        //         } else {
        //             sortedUngroupUsers = [...props.allUsers]
        //                 .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 );
        //         }
        //     }
        //     return [...sortedGroupUsers, ...sortedUngroupUsers].map(user => {
        //         user.show = user.name.toLowerCase().includes(searchUsersValue.value.toLowerCase());
        //         return user;
        //     });
        // });


        return {
            groupUsersList,
            filteredSortedGroupUsers,
            filteredSortedUngroupUsers,
            searchUsersValue,
            currentGroup,
            ungroupUsersList,
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
</style>
