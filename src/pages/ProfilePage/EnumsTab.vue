<template>
    <!-- Enums block -->
    <div class="btns-group-sm">
        <VBox
            v-for="item in enums"
            :key="item?.id"
            :title="item?.title"
            :active="item.id === activeEnumId"
            @click="updateActiveEnumId(item.id)"
            @delete="setEnumToRemove(item)"
        />
    </div>
    <div class="mb-4">
        <div @click="setModalVisible(true)" class="btn-add">
            <div class="btn-add__plus"></div>
            <div class="btn-add__text">Добавить справочник</div>
        </div>
    </div>

    <!-- New Enum Add Form -->
    <EnumsItems v-if="activeEnumId" :enumId="activeEnumId" />

    <ModalWindow v-model="isModalVisible" maxWidth="400px">
        <div class="modal-window__header">
            <h3>Новый справочник</h3>
        </div>
        <div class="form-cont">
            <form @submit="onEnumSubmit">
                <div class="form-wrap__input-wrap form-group">
                    <input
                        v-model="enumTitle"
                        name="enumTitle"
                        type="text"
                        class="form-wrap__input form-control"
                        placeholder="Название справончика"
                    />
                </div>
                <span
                    v-if="errorMessage"
                    class="error-message-wrap"
                >
                    {{errorMessage}}
                </span>
                <button :disabled="!enumFormMeta.valid" type="submit" class="btn btn-primary w-100">
                    <span>Добавить</span>
                </button>
            </form>
        </div>
    </ModalWindow>

    <!-- Remove enum alert -->
    <ModalWindow v-model="isRemoveAlertVisible" maxWidth="400px">
        <div class="modal-window__header">
            <h3>Удаление справочника</h3>
        </div>
        <p>Вы действительно хотите удалить справочник "{{ enumToRemove?.title }}"?</p>
        <div class="modal-window__buttons">
            <v-button class="w-100" @click="removeEnum(enumToRemove?.id)">Удалить</v-button>
            <v-button :outline="true" class="w-100" @click="setRemoveAlertVisible(false)">Отменить</v-button>
        </div>
    </ModalWindow>
</template>
<script>
import {onMounted, ref} from 'vue';
import enumsService from '@/services/enums.service';
import {useForm, useField} from 'vee-validate';
import EnumsItems from '@/pages/ProfilePage/EnumsItems';
import VButton from '@/ui/VButton';
import VBox from '@/ui/VBox';

import ModalWindow from '@/components/ModalWindow.vue';

export default {
    components: {
        EnumsItems,
        VButton,
        ModalWindow,
        VBox,
    },
    setup() {
        const enums = ref([]);
        const activeEnumId = ref(null);
        const updateActiveEnumId = (id) => {
            activeEnumId.value = id;
        };
        onMounted(async () => {
            try {
                enums.value = await enumsService.getEnums();
                if (enums.value.length !== 0) {
                    activeEnumId.value = enums.value[0].id;
                }
            } catch (e) {
                console.log(e.message);
            }
        });

        // Adding New enum____________________________
        const isModalVisible = ref(false);
        const setModalVisible = (bool) => {
            isModalVisible.value = bool;
        };

        const enumSchema = {
            enumTitle(value) {
                if (!value || !value.trim()) {
                    return 'Введите название справочника';
                }
                if (enums.value.map(item => item.title.toLowerCase()).includes(value.toLowerCase())) {
                    return 'Такой справочник уже существует'
                }
                return true;
            }
        };

        const {handleSubmit, meta: enumFormMeta} = useForm({validationSchema: enumSchema});
        const {value: enumTitle, errorMessage} = useField('enumTitle');

        const onEnumSubmit = handleSubmit(async (values, actions) => {
            await addNewEnum(values.enumTitle);
            actions.resetForm();
        });

        const addNewEnum = async (values) => {
            try {
                const newEnum = await enumsService.createEnum(values);
                enums.value = [...enums.value, newEnum];
                setModalVisible(false);
            } catch (e) {
                console.log(e.message);
                setModalVisible(false);
            }
        };

        //Remove Enum______________________________________
        const isRemoveAlertVisible = ref(false);
        const setRemoveAlertVisible = (bool) => {
            isRemoveAlertVisible.value = bool;
        };
        const enumToRemove = ref(null);
        const setEnumToRemove = (item) => {
            enumToRemove.value = item;
            setRemoveAlertVisible(true);
        };
        const removeEnum = async (id) => {
            try {
                await enumsService.removeEnum(id);
                enums.value = [...enums.value].filter((item) => item.id !== id);

                // При удалении активного енума
                if (enumToRemove.value.id === activeEnumId.value) {
                    if (enums.value.length !== 0) {
                        updateActiveEnumId(enums.value[0].id);
                    } else {
                        updateActiveEnumId(null);
                    }
                }
                setRemoveAlertVisible(false);
            } catch (e) {
                console.log(e.message);
            }
        };

        return {
            enums,
            activeEnumId,
            updateActiveEnumId,
            isModalVisible,
            setModalVisible,
            removeEnum,
            enumToRemove,
            isRemoveAlertVisible,
            setRemoveAlertVisible,
            setEnumToRemove,
            addNewEnum,
            onEnumSubmit,
            enumTitle,
            enumFormMeta,
            errorMessage,
        };
    },
};
</script>
<style scoped>
    .error-message-wrap{
        display: block;
        margin-bottom: 10px;
        color: #ff0000;
    }
</style>
