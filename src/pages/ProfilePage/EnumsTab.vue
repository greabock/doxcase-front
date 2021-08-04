<template>
    <!-- Enums block -->
    <div class="btns-group-sm">
        <button
            v-for="item in enums"
            @click="updateActiveEnumId(item.id)"
            class="btn-filter"
            :class="{active: item.id === activeEnumId}"
            :key="item?.id"
        >
            {{ item?.title }}
            <svg @click.stop="setEnumToRemove(item)" class="icon icon-close">
                <use xlink:href="img/svg/sprite.svg#close"></use>
            </svg>
        </button>
    </div>
    <div class="mb-4">
        <div @click="setModalVisible(true)" class="btn-add">
            <div class="btn-add__plus"></div>
            <div class="btn-add__text">Добавить справочник</div>
        </div>
    </div>

    <!-- New Enum Add Form -->
    <enums-items v-if="activeEnumId" :enumId="activeEnumId"></enums-items>
    <div class="mock-modal__wrapper" v-show="isModalVisible">
        <div class="mock-modal__cont">
            <div class="mock-modal__header">
                <span>Новый справочник</span> <b class="mock-modal__closer" @click="setModalVisible(false)">x</b>
            </div>
            <div class="mock-modal__form">
                <Form @submit="addNewEnum" :validation-schema="newEnumSchema">
                    <div class="form-wrap__input-wrap form-group">
                        <Field
                            name="title"
                            type="text"
                            class="form-wrap__input form-control"
                            placeholder="Название справончика"
                        />
                        <ErrorMessage name="title" class="error-feedback" />
                    </div>
                    <button class="btn btn-primary w-100">
                        <span>Добавить</span>
                    </button>
                </Form>
            </div>
        </div>
    </div>
    <!-- Remove enum alert -->
    <div class="mock-modal__wrapper" v-show="isRemoveAlertVisible">
        <div class="mock-modal__cont">
            <div class="mock-modal__header">
                <span
                    >Уверены, что хотите удалить справочник <b> {{ enumToRemove?.title }}</b></span
                >

                <b class="mock-modal__closer" @click="setRemoveAlertVisible(false)">x</b>
            </div>
            <div class="mock-modal__buttons">
                <button class="btn btn-danger" @click="removeEnum(enumToRemove.id)">Удалить</button>
                <button class="btn" @click="setRemoveAlertVisible(false)">Отменить</button>
            </div>
        </div>
    </div>
</template>
<script>
import {onMounted, ref} from 'vue';
import enumsService from '@/services/enums.service';
import {Form, Field, ErrorMessage} from 'vee-validate';
import * as yup from 'yup';
import EnumsItems from '@/pages/ProfilePage/EnumsItems';

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
        EnumsItems,
    },
    setup() {
        const enums = ref([]);
        const activeEnumId = ref(null);
        const newEnumSchema = yup.object().shape({
            title: yup.string().required('Введите название справочника'),
        });

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
        const isModalVisible = ref(false);
        const setModalVisible = (bool) => {
            isModalVisible.value = bool;
        };
        const updateActiveEnumId = (id) => {
            activeEnumId.value = id;
        };
        const addNewEnum = async (name, actions) => {
            try {
                const newEnum = await enumsService.createEnum(name);
                enums.value = [...enums.value, newEnum];
                setModalVisible(false);
                actions.resetForm();
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
            newEnumSchema,
            addNewEnum,
            removeEnum,
            enumToRemove,
            isRemoveAlertVisible,
            setRemoveAlertVisible,
            setEnumToRemove,
        };
    },
};
</script>
<style scoped>
.mock-modal__wrapper {
    display: flex;
    z-index: 10;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
}
.mock-modal__cont {
    display: flex;
    flex-direction: column;
    width: 400px;
    background-color: #fff;
    padding: 30px;
    box-shadow: 0 0 30px 0 rgba(50, 50, 50, 0.46);
}
.mock-modal__header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
}
.mock-modal__closer {
    display: block;
    position: relative;
    top: -20px;
    right: -15px;
    cursor: pointer;
}
.mock-modal__buttons {
    display: flex;
    justify-content: center;
}
.mock-modal__buttons button:first-child {
    margin-right: 5px;
}
</style>
