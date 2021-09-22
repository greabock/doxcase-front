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
        <div v-if="accessType.key !== 'all'">
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
import {ref, computed} from'vue';
import VSelect from '@/ui/VSelect';
import VButton from '@/ui/VButton';
import VMultiBox from '@/ui/VMultiBox';
import {defineAccessType, defineOptions} from '@/utils/section.helpers';

export default {
    components: {VSelect, VButton, VMultiBox},
    props: {
        allUsers: {
          type: Array,
          default: () => []
        },
        allGroups: {
            type: Array,
            default: () => []
        },
        section: {
            type: Object,
            default: () => {}
        },
        initSection: {
            type: Object,
            default: () => {}
        },
    },
    emits: ['updateAccess'],
    setup(props, {emit}) {

        const accessType = ref(defineAccessType(props.section.access));
        const accessTypeOptions = [
            {key: "all", name: "Всем"},
            {key: "only", name: "Только определенным пользователям и группам"},
            {key: "except", name: "Кроме определенных пользователей и групп"},
        ];

        const users = ref(defineOptions(props.section.users));
        const groups = ref(defineOptions(props.section.groups));

        const usersOptions = computed(() => {
            return defineOptions(props.allUsers)
        })
        const groupsOptions = computed(() => {
           return defineOptions(props.allGroups)
        });

        const updateAccess = () => {
            emit('updateAccess', {
                access: accessType.value.key,
                users: users.value.map(user => ({name: user.name, id: user.key})),
                groups: groups.value.map(group => ({name: group.name, id: group.key}))
            })
        }

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