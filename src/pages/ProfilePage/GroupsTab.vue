<template>

    <div class="btns-group-sm">
        <button
            v-for="group in allGroups"
            @click="currentGroup = group"
            class="btn-filter"
            :class="{active: group.id === currentGroup.id}"
            :key="group?.id"
        >
            {{ group?.title }}
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
        v-if="currentGroup.users?.length > 0"
        :usersList="currentGroup.users"
    >
    </group-users-list>

    <modal-window
        v-model="isRemoveModalVisible"
        maxWidth="400px"
    >
        <div class="modal-window__header">
            <h3>Удаление группы</h3>
        </div>
        <p>Вы действительно хотите удалить группу "{{ groupToRemove?.title }}"?</p>
        <div class="modal-window__buttons">
            <v-button class="w-100" @click="removeGroup(groupToRemove)">Удалить</v-button>
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
                    v-model="titleValue"
                    class="form-wrap__input form-control"
                    type="text"
                    placeholder="Введите название"
                />
                </label>
                <span class="validation-error">{{titleError}}</span>
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
                class="users-list-fom-wrapper sSections__col col-lg-auto col-md"
            >
                <template
                    v-for='user in sortedFilteredAllUsers'
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
import groupUsersList from '@/pages/ProfilePage/GroupUsersList';
import * as yup from 'yup';
import {useField, useForm} from 'vee-validate';
import usersService from '@/services/users.service';
import groupService from '@/services/group.service';
import {v4 as uuidv4} from 'uuid';

export default {
    components: {
        VButton,
        ModalWindow,
        groupUsersList
    },
    setup() {

//Выбор группы________________________
        const allGroups = ref([]);
        const allUsers = ref([]);
        const currentGroup = ref({});

        const sortedFilteredAllUsers = computed(() => {
            return [...allUsers.value]
                .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 )
                .map(user => {
                    user.show = user.name.toLowerCase().includes(searchValue.value.toLowerCase());
                    return user;
                });
        })


        const mixedUsers = computed(() => {
            let sortedGroupUsers = [];
            let sortedUngroupUsers = [];

            if (currentGroup.value.users?.length > 0) {
                sortedGroupUsers = currentGroup.value.users.map(user => user.is = true)
                    .sort((a, b) => (a.name > b.name)? 1 : -1)
            }

            if (allUsers.value.length > 0) {
                if (sortedGroupUsers.length) {

                    const sortedGroupIds = sortedGroupUsers.map(user => user.id) // Массив Id-шников из Списка пользователей
                    sortedUngroupUsers = allUsers.value
                        .filter((user) => !sortedGroupIds.includes(user.id))
                        .sort((a, b) => (a.name > b.name) ? 1 : -1 );
                } else {
                    sortedUngroupUsers = [...allUsers.value]
                        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 );
                }
            }
            return [...sortedGroupUsers, ...sortedUngroupUsers];
        });

// Добавление группы__________________
        const isAddModalVisible = ref(false);
        const schema = yup.object({
            title: yup.string().required('Поле обязательно для заполнения')
        });

        const {handleSubmit, meta: formMeta} = useForm({
            validationSchema: schema
        });
        const {value: titleValue, errorMessage: titleError} = useField('title');

        const submitHandle = handleSubmit(async ({title}) => {

           const groupUsers = [...sortedFilteredAllUsers.value]
               .filter(item => item.is === true).map( item => {
                   delete item.is;
                   delete item.show;
                   return item;
               });

           const newGroup = {
               title,
               id: uuidv4(),
               values: groupUsers
           }
           try {
               await groupService.addGroup(newGroup);
               allGroups.value.push(newGroup);
               currentGroup.value = newGroup;
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
        const removeGroup = (id) => {
            allGroups.value = allGroups.value.filter(group => group.id !== id);
            isRemoveModalVisible.value = false;
        }

// Поиск пользователей_________________
        const searchValue = ref('');

        const fetchAllUsers = async () => {
            try {
                allUsers.value = await usersService.getUsers();
            } catch (e) {
                console.log(e);
            }
        };

        const fetchAllGroups = async () => {
            try {
                allGroups.value = await groupService.getAllGroups();
            } catch (e) {
                console.log(e);
            }
        };

        onMounted(() => {
                fetchAllUsers();
                fetchAllGroups();
                if (allGroups.value.length) {
                    currentGroup.value = allGroups.value[0];
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
            titleValue,
            titleError,
            formMeta,
            mixedUsers,
            sortedFilteredAllUsers,
        }
    }
};
</script>

<style scoped>
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
    max-height: 500px;
    overflow-x: visible;
    overflow-y: auto;
    padding: 5px 0 5px 5px;
    margin: 0 0 20px -5px;
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
