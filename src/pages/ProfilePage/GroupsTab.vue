<template>

    <div
        class="btns-group-sm groups-users-buttons"
    >
        <VBox
            v-for="group in allGroups"
            :key="group?.id"
            :title="group?.name"
            :active="group.id === currentGroup.id"
            @click="currentGroup = group"
            @delete="setGroupToRemove(group)"
        />
    </div>

    <div class="mb-4 groups-users-add-button">
        <div @click="isAddModalVisible = true" class="btn-add">
            <div class="btn-add__plus"></div>
            <div class="btn-add__text">Добавить группу</div>
        </div>
    </div>
    <group-users-list
        :allUsers="noAdminUsers"
        :propGroup="currentGroup"
        v-if="currentGroup?.id && allUsers.length > 0"
        @updateGroup="updateGroup"
        @cancelUpdate="cancelUpdateGroup"
    >
    </group-users-list>

<!-- Удаление группы -->
    <modal-window
        v-model="isRemoveModalVisible"
        maxWidth="400px"
    >
        <div class="modal-window__header">
            <h3>Удаление группы</h3>
        </div>
        <p>Вы действительно хотите удалить группу "{{ groupToRemove?.name }}"?</p>
        <div class="modal-window__buttons">
            <v-button class="w-100" @click="removeGroup()">Удалить</v-button>
            <v-button :outline="true" class="w-100" @click="isRemoveModalVisible = false">Отменить</v-button>
        </div>
    </modal-window>

<!-- Создание группы -->
    <modal-window
        v-model="isAddModalVisible"
        maxWidth="600px"
        @close="closeModalHandle"
    >
        <div class="modal-window__header">
            <h3>Создание группы пользователей</h3>
        </div>
        <form @submit="submitHandle">
            <div class="form-wrap__input-wrap form-group">
                <label
                ><span class="form-wrap__input-title">Название группы</span
                ><input
                    v-model="nameValue"
                    class="form-wrap__input form-control"
                    type="text"
                    placeholder="Введите название"
                />
                </label>
                <span class="validation-error">{{nameError}}</span>
            </div>
            <span class="form-wrap__input-title">Поиск</span>
            <div class="modal_search-block">
                <div class="form-wrap__input-title form-group">
                    <input
                        v-model="searchValue"
                        class="form-wrap__input form-control"
                        name="text"
                        type="text"
                        placeholder="Введите фамилию"
                    />
                </div>
                <button
                    @click.prevent
                    class="search-block__btn"
                >
                    <svg class="icon icon-search">
                        <use xlink:href="/img/svg/sprite.svg#search"></use>
                    </svg>
                </button>
            </div>

            <div
                class="users-list-fom-wrapper max-h-240 sSections__col col-lg-auto col-md"
            >
                <template
                    v-for='user in sortedFilteredAllUsers'
                    :key='user.id'
                >
                    <label
                        v-show="user.modalShow"
                        class="groups-users-list__item custom-input form-check"
                    >
                        <input
                            class="custom-input__input form-check-input"
                            type="checkbox"
                            v-model="user.is"
                        />
                        <span class="custom-input__text form-check-label">
                            {{ user.name }}
                        </span>
                    </label>
                </template>
            </div>
            <button
                :disabled="!formMeta.valid"
                class="btn btn-primary w-100"
                type="submit"
            >
                Создать группу
            </button>
        </form>
    </modal-window>


    <div class="users-list-loader" v-if="loading"><span class="spinner-border"></span></div>
</template>

<script>
import {ref, computed, onMounted} from 'vue';
import VButton from '@/ui/VButton';
import VBox from '@/ui/VBox';
import ModalWindow from '@/components/ModalWindow';
import GroupUsersList from '@/pages/ProfilePage/GroupUsersList';
import {useField, useForm} from 'vee-validate';
import usersService from '@/services/users.service';
import groupService from '@/services/group.service';
import {v4 as uuidv4} from 'uuid';

export default {
    components: {
        VButton,
        ModalWindow,
        GroupUsersList,
        VBox
    },
    setup() {

//Выбор группы________________________
        const allGroups = ref([]);
        const allUsers = ref([]);
        const noAdminUsers = computed(() => {
            return [...allUsers.value].filter(user => user.role !== 'admin');
        })
        const currentGroup = ref({});
        const loading = ref(false);

        const sortedFilteredAllUsers = computed(() => {
            return [...noAdminUsers.value]
                .map(user => {
                    user.modalShow = user.name.toLowerCase().includes(searchValue.value.toLowerCase());
                    return user;
                })
                .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 )
        })

// Поиск пользователей_________________
        const searchValue = ref('');

        const fetchAllUsers = async () => {
            try {
                return await usersService.getUsers();
            } catch (e) {
                console.log(e);
            }
        };

// Добавление группы__________________
        const isAddModalVisible = ref(false);
        const schema = {
            name(value) {
                if (!value || !value.trim()) {
                    return 'Введите название группы';
                }
                if (allGroups.value.map(item => item.name.toLowerCase()).includes(value.toLowerCase())) {
                    return 'Такая группа уже существует'
                }
                return true;
            }
        };

        const {handleSubmit, meta: formMeta, resetForm} = useForm({
            validationSchema: schema
        });
        const {value: nameValue, errorMessage: nameError} = useField('name');

        const submitHandle = handleSubmit(async ({name}) => {

           const groupUsers = [...sortedFilteredAllUsers.value]
               .filter(user => user.is === true).map( user => {
                   user.is = false;
                   return {
                       id: user.id,
                       name: user.name,
                       role: user.role,
                       email: user.email,
                       photo: user.photo
                   };
               });

           const newGroup = {
               name,
               id: uuidv4(),
               users: groupUsers
           }
           try {
               const res = await groupService.addGroup(newGroup);
               allGroups.value.push(res);
               currentGroup.value = res;
               isAddModalVisible.value = false;
               searchValue.value = '';
               resetForm();
           } catch(e) {
               console.log(e);
           }
        });

        const closeModalHandle = () => {
            resetForm();
            searchValue.value = '';
            sortedFilteredAllUsers.value.forEach(user => user.is = false);
        }

// Удаление группы____________________
        const isRemoveModalVisible = ref(false);
        const groupToRemove = ref(null);
        const setGroupToRemove = (group) => {
            groupToRemove.value = group;
            isRemoveModalVisible.value = true;
        };
        const removeGroup = async () => {
            try {
                loading.value = true;
                await groupService.removeGroup(groupToRemove.value.id);
                allGroups.value = allGroups.value.filter(group => group.id !== groupToRemove.value.id);
                currentGroup.value = allGroups.value[0];
             } catch(e) {
                console.log(e);
            } finally {
                isRemoveModalVisible.value = false;
                loading.value = false;
            }

        }

        const fetchAllGroups = async () => {
            try {
                const res = await groupService.getAllGroups();
                allGroups.value = res;
                return res;

            } catch (e) {
                console.log(e);
            }
        };

        const updateGroup = (updatedGroup) => {
            const idx = allGroups.value.findIndex(group => group.id === updatedGroup.id);
            allGroups.value = [
                ...allGroups.value.slice(0, idx),
                updatedGroup,
                ...allGroups.value.slice(idx + 1)
            ];
            currentGroup.value = updatedGroup;
        }

        const cancelUpdateGroup = () => {
            currentGroup.value = {...currentGroup.value}
        }

        onMounted(async () => {
            try {
                loading.value = true;
                allUsers.value = await fetchAllUsers();
                const groups = await fetchAllGroups();
                if (groups.length) {
                    currentGroup.value = groups[0];
                }
            } catch(e) {
                console.log(e);
            } finally {
                loading.value = false;
            }

        });

        return {
            currentGroup,
            allGroups,
            isAddModalVisible,
            isRemoveModalVisible,
            groupToRemove,
            setGroupToRemove,
            removeGroup,
            searchValue,
            submitHandle,
            nameValue,
            nameError,
            formMeta,
            allUsers,
            noAdminUsers,
            sortedFilteredAllUsers,
            updateGroup,
            cancelUpdateGroup,
            loading,
            closeModalHandle,
        }
    }
};
</script>

<style>
.btn {
    align-items: center;
}
.modal_search-block {
    position: relative;
    margin-bottom: 20px;
}
.modal_search-block .search-block__btn {
    padding: 16px 13px 0;
}
.modal_search-block .search-block__btn svg {
    font-size: 1.2rem;
}
.validation-error {
    display: block;
    margin-top: 5px;
    color: #ff0000;
}
.users-list-fom-wrapper {
    overflow-x: visible;
    overflow-y: auto;
    padding: 0 0 0 5px;
    margin: 0 0 0 -5px;
}

.max-h-240 {
max-height: 240px!important;
    margin-bottom: 20px !important;
}

.users-list-fom-wrapper::-webkit-scrollbar {
    width: 4px;               /* ширина scrollbar */
}
.users-list-fom-wrapper::-webkit-scrollbar-track {
    background: #c4c4c4;        /* цвет дорожки */
}
.users-list-fom-wrapper::-webkit-scrollbar-thumb {
    background-color: #1D47CE;    /* цвет плашки */
    border-radius: 3px;       /* закругления плашки */
    border: 0;  /* padding вокруг плашки */
}

.users-list-fom-wrapper .form-check {
    padding-top: 5px;
    padding-left: 25px;
    margin-bottom: 11px;
}
.users-list-fom-wrapper .form-check-input {
    width: 1.5em;
    height: 1.5em;
    margin-top: 0;
}
.users-list-fom-wrapper .form-check-input[type="checkbox"] {
    background-size: 80%;
    margin-right: 10px;
    background-position-x: center;
}
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
.error-message-wrap{
    display: block;
    margin-bottom: 10px;
    color: #ff0000;
}
</style>
