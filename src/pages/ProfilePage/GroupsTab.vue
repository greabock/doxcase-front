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

        const allGroups = ref(mockGroups);
        const currentGroupId = ref(null);
        const setCurrentGroupId = (id) => {
            currentGroupId.value = id;
        }

        const isAddModalVisible = ref(false);

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
        return {
            currentGroupId,
            allGroups,
            setCurrentGroupId,
            isAddModalVisible,
            isRemoveModalVisible,
            groupToRemove,
            setGroupToRemove,
            removeGroup,
        }
    }
};
</script>

<style scoped>
</style>
