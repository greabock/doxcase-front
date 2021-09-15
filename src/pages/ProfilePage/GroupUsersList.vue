<template>
    <div
        class="h3 mb-3"
    >{{currentGroup.name}}
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
            v-for='user in filteredMixedUsers'
            :key='user.id'
        >
            <label
                v-show="user.show"
                class="groups-users-list__item custom-input form-check"
            ><input
                class="custom-input__input form-check-input"
                type="checkbox"
                v-model="user.is"
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
</template>

<script>
import {ref, computed} from 'vue';
import VButton from '@/ui/VButton';

export default {
    components: {
        VButton
    },
    props: {
        allUsers: {
            type: Array,
            default: () => []
        },
        currentGroup: {
            type: Object,
            default: null
        }
    },
    setup(props) {

        const searchUsersValue = ref('');
        const mixedUsers = computed(() => {
            let sortedGroupUsers = [];
            let sortedUngroupUsers = [];

            if (props.currentGroup.users && props.currentGroup.users.length > 0) {
                sortedGroupUsers = props.currentGroup.users.map(user => user.is = true)
                    .sort((a, b) => (a.name > b.name)? 1 : -1)
            }

            if (props.allUsers.length > 0) {
                if (sortedGroupUsers.length) {

                    const sortedGroupIds = sortedGroupUsers.map(user => user.id) // Массив Id-шников из Списка пользователей
                    sortedUngroupUsers = props.allUsers
                        .filter((user) => !sortedGroupIds.includes(user.id))
                        .sort((a, b) => (a.name > b.name) ? 1 : -1 );
                } else {
                    sortedUngroupUsers = [...props.allUsers]
                        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 );
                }
            }
            return [...sortedGroupUsers, ...sortedUngroupUsers];
        });

        const filteredMixedUsers = computed(() => {
            return [...mixedUsers.value]
                .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 )
                .map(user => {
                    user.show = user.name.toLowerCase().includes(searchUsersValue.value.toLowerCase());
                    return user;
                });
        })



        return {
            searchUsersValue,
            mixedUsers,
            filteredMixedUsers,
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
