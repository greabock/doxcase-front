<template>

    <div
        class="btns-group-sm">
        <button
            v-for="group in allGroups"
            @click="currentGroup = group"
            class="btn-filter"
            :class="{active: group.id === currentGroup.id}"
            :key="group?.id"
        >
            {{ group?.name }}
            <svg @click.stop="() => setGroupToRemove(group)" class="icon icon-close">
                <use xlink:href="/img/svg/sprite.svg#close"></use>
            </svg>
        </button>
    </div>
    <div class="mb-4">
        <div @click="isAddModalVisible = true" class="btn-add">
            <div class="btn-add__plus"></div>
            <div class="btn-add__text">Добавить группу</div>
        </div>
    </div>

    <group-users-list
        :allUsers="allUsers"
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
            <button
                :disabled="!formMeta.valid"
                class="btn btn-primary w-100"
                type="submit"
            >
                Создать группу
            </button>
        </form>
    </modal-window>



</template>

<script>
import {ref, computed, onMounted} from 'vue';
import VButton from '@/ui/VButton';
import ModalWindow from '@/components/ModalWindow';
import GroupUsersList from '@/pages/ProfilePage/GroupUsersList';
import * as yup from 'yup';
import {useField, useForm} from 'vee-validate';
import usersService from '@/services/users.service';
import groupService from '@/services/group.service';
import {v4 as uuidv4} from 'uuid';

export default {
    components: {
        VButton,
        ModalWindow,
        GroupUsersList
    },
    setup() {

//Выбор группы________________________
        const allGroups = ref([]);
        const allUsers = ref([]);
        const currentGroup = ref({});

        const sortedFilteredAllUsers = computed(() => {
            return [...allUsers.value]
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
                allUsers.value = await usersService.getUsers();
            } catch (e) {
                console.log(e);
            }
        };

// Добавление группы__________________
        const isAddModalVisible = ref(false);
        const schema = yup.object({
            name: yup.string().required('Поле обязательно для заполнения')
        });

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

// Удаление группы____________________
        const isRemoveModalVisible = ref(false);
        const groupToRemove = ref(null);
        const setGroupToRemove = (group) => {
            groupToRemove.value = group;
            isRemoveModalVisible.value = true;
        };
        const removeGroup = async () => {
            try {
                await groupService.removeGroup(groupToRemove.value.id);
                allGroups.value = allGroups.value.filter(group => group.id !== groupToRemove.value.id);
                currentGroup.value = allGroups.value[0];
             } catch(e) {
                console.log(e);
            } finally {
                isRemoveModalVisible.value = false;
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
                await fetchAllUsers();
                const groups = await fetchAllGroups();
                if (groups.length) {
                    currentGroup.value = groups[0];
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
            allUsers,
            submitHandle,
            nameValue,
            nameError,
            formMeta,
            sortedFilteredAllUsers,
            updateGroup,
            cancelUpdateGroup,
        }
    }
};
</script>

<style>
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
    padding: 5px 0 63px 5px;
    margin: 0 0 20px -5px;
}
.max-h-240 {
max-height: 240px!important;
    padding-bottom: 0;
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
    padding-left:25px;
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
</style>
