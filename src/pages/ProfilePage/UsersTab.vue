<template>
    <div class="mb-3">
        <div class="search-block">
            <form>
                <div class="search-block__input-wrap form-group">
                    <input
                        v-model="searchUserValue"
                        class="search-block__input form-control"
                        name="text"
                        type="text"
                        placeholder="Поиск"
                    />
                </div>
                <!-- +e.input-wrap-->
                <button class="search-block__btn" type="submit">
                    <svg class="icon icon-search">
                        <use xlink:href="img/svg/sprite.svg#search"></use>
                    </svg>
                </button>
            </form>
        </div>
    </div>
    <div class="mb-3">
        <table class="table">
            <thead>
                <tr>
                    <th>ФИО</th>
                    <th>Роль</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in searchedUsersList" :key="user?.id">
                    <td class="fw-500">{{ user.name }}</td>
                    <td>
                        <div class="sCabinetMain__input-wrap form-group">
                            <select
                                @change="switchUserRole($event.target.value, user)"
                                v-model="user.role"
                                class="sCabinetMain__input form-select select-small"
                                name="select"
                            >
                                <option value="admin">Администратор</option>
                                <option value="moderator">Модератор</option>
                                <option value="user">Пользователь</option>
                            </select>
                        </div>
                        <!-- +e.input-wrap-->
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="users-list-loader" v-if="loading">Смена прав пользователя...</div>
        <div class="error-message" v-if="error">
            <div>Ошибка при смене прав пользователя</div>
            <button class="btn btn-danger" @click="skipError">Продолжить</button>
        </div>
    </div>
</template>

<script>
import {computed, onMounted, ref} from 'vue';
import usersService from '@/services/users.service';

export default {
    setup() {
        const usersList = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const searchUserValue = ref('');
        const switchUserRole = async (e, user) => {
            try {
                loading.value = true;
                await usersService.setNewRole(e, user);
            } catch (e) {
                loading.value = false;
                error.value = e.message;
            } finally {
                loading.value = false;
            }
        };
        const fetchUsers = async () => {
            try {
                loading.value = true;
                usersList.value = await usersService.getUsers();
            } catch (e) {
                loading.value = false;
                error.value = e.message;
                console.log(e.message);
            } finally {
                loading.value = false;
            }
        };

        const skipError = () => {
            fetchUsers();
            error.value = null;
        };

        onMounted(fetchUsers);
        return {
            searchedUsersList: computed(() => {
                return [...usersList.value].filter((user) =>
                    user.name.toLowerCase().includes(searchUserValue.value.toLowerCase())
                );
            }),
            switchUserRole,
            searchUserValue,
            loading,
            error,
            skipError,
        };
    },
};
</script>
<style scoped>
.users-list-loader {
    position: absolute;
    color: #394dce;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.5);
}
.error-message {
    position: absolute;
    color: #394dce;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(255, 0, 0, 0.2);
}
</style>
