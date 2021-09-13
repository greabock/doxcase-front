<template>

    <div class="btns-group-sm">
        <button
            v-for="group in allGroups"
            @click="setCurrentGroupId(group.id)"
            class="btn-filter"
            :class="{active: group.id === currentGroupId}"
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

    <modal-window
        v-model="isRemoveModalVisible"
        maxWidth="400px"
    >
        <div class="modal-window__header">
            <h3>Удаление группы</h3>
        </div>
        <p>Вы действительно хотите удалить группу "{{ groupToRemove?.title }}"?</p>
        <div class="modal-window__buttons">
            <v-button class="w-100" @click="removeGroup(groupToRemove?.id)">Удалить</v-button>
            <v-button :outline="true" class="w-100" @click="isRemoveModalVisible = false">Отменить</v-button>
        </div>
    </modal-window>

    <modal-window
        v-model="isAddModalVisible"
        maxWidth="600px"
    >
        <div class="modal-window__header">
            <h3>Выберите пользователей</h3>
        </div>

        <div class="search-block">
            <div class="search-block__input-wrap form-group">
                <input
                    v-model="searchUser"
                    class="search-block__input form-control"
                    name="text"
                    type="text"
                    placeholder="Введите фамилию"
                />
            </div>
            <!-- +e.input-wrap-->
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
            v-if='mockUsers.length > 0'
            class="sSections__col col-lg-auto col-md"
        >
            <label
                v-for='user in mockUsers'
                :key='user.id'
                class="groups-users-list__item custom-input form-check"
            ><input
                class="custom-input__input form-check-input"
                type="checkbox"
                v-model="user.is"
            /><span class="custom-input__text form-check-label"
            >{{ user.name }}</span
            >
            </label>
        </div>
    </modal-window>



</template>

<script>
import {ref} from 'vue';
import VButton from '@/ui/VButton';
import ModalWindow from '@/components/ModalWindow';

export default {
    components: {
        VButton,
        ModalWindow
    },
    props: {
        allUsers: {
            type: Array,
            default: () => []
        }
    },
    setup() {
        const mockGroups = [
            { id: 1, title: 'Менеджеры'},
            { id: 2, title: 'Программисты'},
            { id: 3, title: 'Музыканты'},
            { id: 4, title: 'Директоры'},
        ]
//Выбор группы________________________
        const allGroups = ref(mockGroups);
        const currentGroupId = ref(null);
        const setCurrentGroupId = (id) => {
            currentGroupId.value = id;
        }
// Добавление группы__________________
        const isAddModalVisible = ref(false);

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
        const searchUser = ref('');
    const mockUsers = [
        {name: 'Анатолий Вассел', id: 1, is: true},
        {name: 'Елена Шмара', id: 2, is: false},
        {name: 'Сергей Шляхов', id: 3, is: false},
        {name: 'Анатолий Вассел', id: 4, is: true}
    ]

        return {
            currentGroupId,
            allGroups,
            setCurrentGroupId,
            isAddModalVisible,
            isRemoveModalVisible,
            groupToRemove,
            setGroupToRemove,
            removeGroup,
            searchUser,
            mockUsers
        }
    }
};
</script>

<style scoped>
.search-block {
    position: relative;
    margin-bottom: 20px;
}
.search-block__input {
    height: 2.7rem;
    padding-left: 1rem;
    padding-right: 2.7rem;
    font-size: 0.95rem;
}
.search-block__btn {
    padding: 11px 10px;
}
.search-block__btn svg {
    font-size: 1.2rem;
}
.groups-users-list__item {

}
.groups-users-list__item .form-check-input {
    width: 1.4em;
    height: 1.4em;
    margin-top: 0;
    margin-right: 10px;
}
</style>
