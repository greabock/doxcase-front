<template>
    <div
        class="h3 mb-3"
    >!Заголовок группы!
    </div>
    <div class="search-block">
        <form>
            <div class="search-block__input-wrap form-group">
                <input
                    v-model="searchValue"
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
    <div class="block-position" v-if="searchedUsers.length > 0">
        <div class="block-position__item" v-for="user in searchedUsers" :key="user?.id">
            <div class="block-position__title">{{ user?.name }}</div>
            <div class="block-position__btns">
                <div @click="setUserToRemove(user)" class="btn-edit-sm btn-danger">
                    <svg class="icon icon-basket">
                        <use xlink:href="/img/svg/sprite.svg#basket"></use>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Remove enumItem alert -->
    <modal-window
        @close="setRemoveAlertVisible(false)"
        v-model="isRemoveAlertVisible"
        maxWidth="400px"
    >
        <div class="modal-window__header">
            <h3>Удаление пользователя из группы</h3>
        </div>
        <span>
            Вы действительно хотите удалить пользователя "{{ userToRemove?.name }}" из справочника
            "!Заголовок группы!"?
            </span>
        <div class="modal-window__buttons">
            <v-button class="w-100" @click="removeUser(userToRemove)">Удалить</v-button>
            <v-button :outline="true" class="w-100" @click="setRemoveAlertVisible(false)">Отменить</v-button>
        </div>
    </modal-window>
</template>

<script>
import VButton from '@/ui/VButton';
import {ref, computed} from 'vue';
import enumsService from '@/services/enums.service';
import ModalWindow from '@/components/ModalWindow';

export default {
    components: {
        VButton,
        ModalWindow,
    },
    props: {
        usersList: {
            type: Array,
            default: () => []
        },
    },
    setup(props) {
        const groupUsers = ref(props.usersList);

        const searchValue = ref('');
        const searchedUsers = computed(() => {
            if (groupUsers.value) {
                return groupUsers.value.filter((user) => {
                    return user.name.toLowerCase().includes(searchValue.value.toLowerCase());
                });
            }
            return [];
        });

        // Remove EnumItem__________________________
        const isRemoveAlertVisible = ref(false);
        const setRemoveAlertVisible = (bool) => {
            isRemoveAlertVisible.value = bool;
        };
        const userToRemove = ref(null);
        const setUserToRemove = (user) => {
            userToRemove.value = user;
            setRemoveAlertVisible(true);
        };
        const removeUser = async (myEnum, enumItemId) => {
            try {
                groupUsers.value = await enumsService.removeEnumsItem(myEnum, enumItemId);
                setRemoveAlertVisible(false);
            } catch (e) {
                console.log(e.message);
            }
        };

        return {
            groupUsers,
            searchValue,
            searchedUsers,
            userToRemove,
            setUserToRemove,
            isRemoveAlertVisible,
            setRemoveAlertVisible,
            removeUser,
        };
    },
};
</script>

<style scoped>
INPUT::placeholder {
    color: #d6d6d6;
}
.block-position__item {
    margin-top: 10px;
}
</style>
