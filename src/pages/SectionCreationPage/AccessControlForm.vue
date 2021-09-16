<template>
    <div class="h3 mb-4">Управление общим доступом</div>
    <span class="form-wrap__input-title">Выберите тип доступа</span>
    <v-select
        class="mb-3"
        v-model="accessType"
        :options="accessTypeOptions"
        bordered
    />
    <!-- +e.input-wrap-->
    <div class="typed-field-forms">
        <div v-if="accessType.key === 'include'">
            <span class="form-wrap__input-title">Группы</span>
            <v-multi-box
                v-model="groups"
                :options="groupsOptions"
                :bordered="true"
            >
            </v-multi-box>
            <span class="form-wrap__input-title">Пользователи</span>
            <v-multi-box
                v-model="users"
                :options="usersOptions"
                :bordered="true"
            >
            </v-multi-box>
        </div>
    </div>
    <div class="modal-window__buttons">
        <v-button class="w-100" @click="updateAccess">Сохранить</v-button>
    </div>
</template>

<script>
import {ref, computed, onMounted} from'vue';
import VSelect from '@/ui/VSelect';
import VButton from '@/ui/VButton';
import VMultiBox from '@/ui/VMultiBox';
import usersService from '@/services/users.service';
import groupService from '@/services/group.service';


export default {
    components: {VSelect, VButton, VMultiBox},
    props: {
        section: {
            type: Object,
            default: () => {}
        },
        initSection: {
            type: Object,
            default: () => {}
        },
    },
    emits: ['updateAccess','closeModal'],
    setup(props, {emit}) {
        const accessType = ref({key: "all", name: "Всем"});
        const accessTypeOptions = [
            {key: "all", name: "Всем"},
            {key: "include", name: "Только определенным пользователям и группам"},
        ];

        const users = ref(props.section.users);
        const groups = ref(props.section.groups);
        const allUsers = ref([]);
        const allGroups = ref([]);

        const usersOptions = computed(() => {
            return allUsers.value
                .map(user => ({ name: user.name, key: user.id}))
                .sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
        })
        const groupsOptions = computed(() => {
           return allGroups.value
               .map(group => ({name: group.name, key: group.id}))
               .sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
        });

        const updateAccess = () => {
            emit('updateAccess', {
                type: accessType.value.key,
                users: users.value.map(user => ({name: user.name, id: user.key})),
                groups: groups.value.map(group => ({name: group.name, id: group.key}))
            })
        }

        onMounted( async () => {
            try {
                allUsers.value = await usersService.getUsers();
                allGroups.value = await groupService.getAllGroups();
            } catch(e) {
                console.log(e);
            }
        })
        return {
            accessType,
            accessTypeOptions,
            users,
            groups,
            usersOptions,
            groupsOptions,
            updateAccess,
        }
    }
};
</script>

<style scoped>

</style>