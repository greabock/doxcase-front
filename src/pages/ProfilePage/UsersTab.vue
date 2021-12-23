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
                <button class="search-block__btn" @click.stop.prevent type="submit">
                    <svg class="icon icon-search">
                        <use xlink:href="/img/svg/sprite.svg#search"></use>
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
            <tr>
              <td colspan='2'>
                <div class="mb-4">
                  <div @click="isModalVisible = true" class="btn-add">
                    <div class="topLine__btn topLine__btn--plus btn-primary"></div>
                    <div class="btn-add__text">Добавить пользователя</div>
                  </div>
                </div>
              </td>
            </tr>
                <tr v-for="user in searchedFilteredUsers" :key="user?.id">
                    <td class="fw-500">{{ user.name }}</td>
                    <td>
                        <div class="sCabinetMain__input-wrap form-group user-edit-buttons">
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

                            <div
                                @click.stop="serUserToEdit(user)"
                                class="btn-edit-sm btn-secondary">
                                <svg class="icon icon-edit">
                                    <use xlink:href="/img/svg/sprite.svg#edit"></use>
                                </svg>
                            </div>

                            <div
                                @click="setUserToRemoveHandler(user)"
                                class="btn-edit-sm btn-danger"
                            >
                                <svg class="icon icon-basket">
                                    <use xlink:href="/img/svg/sprite.svg#basket"></use>
                                </svg>
                            </div>
                        </div>
                        <!-- +e.input-wrap-->
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="users-list-loader" v-if="loading"><span class="spinner-border"></span></div>
        <div class="error-message" v-if="error">
            <div>Ошибка при смене прав пользователя</div>
            <button class="btn btn-danger" @click="skipError">Продолжить</button>
        </div>
    </div>
<!-- Создание пользователя -->
      <modal-window
        v-model="isModalVisible"
      >
        <add-user-form
          @addNewUser="addNewUserHandle"
          @closeModal="isModalVisible = false"
        ></add-user-form>
      </modal-window>

<!-- Редактирование пользователя -->
    <modal-window
        v-model="isEditUserModal"
    >
        <edit-user-form
            :user="userToEdit"
            @updateUser="updateUserHandle"
            @closeModal="isEditUserModal = false"
        ></edit-user-form>
    </modal-window>

    <!-- Удаление группы -->
    <modal-window
        v-model="isRemoveModalVisible"
        maxWidth="400px"
    >
        <div class="modal-window__header">
            <h3>Удаление пользователя</h3>
        </div>
        <p>Вы действительно хотите удалить пользователя "{{ userToRemove?.name }}"?</p>
        <div class="modal-window__buttons">
            <v-button class="w-100" @click="removeUser()">Удалить</v-button>
            <v-button :outline="true" class="w-100" @click="isRemoveModalVisible = false">Отменить</v-button>
        </div>
    </modal-window>
</template>

<script>
import {computed, onMounted, ref} from 'vue';
import usersService from '@/services/users.service';
import ModalWindow from "@/components/ModalWindow";
import AddUserForm from '@/pages/ProfilePage/AddUserForm';
import VButton from '@/ui/VButton';
import EditUserForm from '@/pages/ProfilePage/EditUserForm';

export default {
  components: {
    ModalWindow,
    AddUserForm,
    VButton,
    EditUserForm,
  },
    props: {
      currentUser: {
          type: Object
      }
    },
    setup(props) {
        const usersList = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const searchUserValue = ref('');

        const searchedFilteredUsers = computed(() => {
            return [...usersList.value]
                .filter((user) => user.id !== props.currentUser.id)
                .filter((user) => user.name.toLowerCase().includes(searchUserValue.value.toLowerCase()))
                .sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 ))
        });

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
        const isModalVisible = ref(false);
        const setModalVisible = (bool) => {
          isModalVisible.value = bool;
        }

        const skipError = () => {
            fetchUsers();
            error.value = null;
        };
        const addNewUserHandle = (user) => {
            usersList.value = [...usersList.value, user];
        }
// Редактирование пользователя__________________________
        const userToEdit = ref({});
        const isEditUserModal = ref(false);
        const serUserToEdit = (user) => {
            userToEdit.value = user;
            isEditUserModal.value = true;
        }
        const updateUserHandle = (user) => {
            const idx = usersList.value.findIndex(u => u.id === user.id);
            usersList.value = [
                ...usersList.value.slice(0, idx),
                user,
                ...usersList.value.slice(idx + 1)
            ];
        }

// Удаление пользователя________________________________
        const isRemoveModalVisible = ref(false);
        const userToRemove = ref(null);
        const setUserToRemove = (user) => {
            userToRemove.value = user;
        }
        const setUserToRemoveHandler = (user) => {
            isRemoveModalVisible.value = true;
            setUserToRemove(user);
        }
        const removeUser = async () => {
            try {
                await usersService.removeUser(userToRemove.value.id);
                usersList.value = [...usersList.value].filter(user => user.id !== userToRemove.value.id);
            } catch(e) {
                console.log(e);
            } finally {
                isRemoveModalVisible.value = false;
            }
        }

        onMounted(fetchUsers);

        return {
            searchedFilteredUsers,
            switchUserRole,
            searchUserValue,
            loading,
            error,
            skipError,
            isModalVisible,
            setModalVisible,
            addNewUserHandle,
            isRemoveModalVisible,
            userToRemove,
            removeUser,
            setUserToRemoveHandler,
            serUserToEdit,
            isEditUserModal,
            userToEdit,
            updateUserHandle,
        };
    },
};
</script>
<style scoped>
.users-list-loader {
    position: absolute;
    color: var(--bs-primary);
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
.sCabinetMain__input-wrap {
    display: flex;
}
.sCabinetMain__input-wrap select {
    margin-right: 5px;
}
.user-edit-buttons .btn-secondary {
    margin-right: 5px;
    flex-shrink: 0;
}
.user-edit-buttons .btn-danger {
    flex-shrink: 0;
}
.sCabinetMain table td:nth-child(2){
    width:220px;
}
.sCabinetMain table .sCabinetMain__input-wrap {
    width:auto
}
</style>
