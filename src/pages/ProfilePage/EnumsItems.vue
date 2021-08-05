<template>
    <div v-if="enumObject" class="h3 mb-3">{{ enumObject?.title }}</div>
    <div class="search-block">
        <form>
            <div class="search-block__input-wrap form-group">
                <input class="search-block__input form-control" name="text" type="text" placeholder="Поиск" />
            </div>
            <!-- +e.input-wrap-->
            <button class="search-block__btn" type="submit">
                <svg class="icon icon-search">
                    <use xlink:href="img/svg/sprite.svg#search"></use>
                </svg>
            </button>
        </form>
    </div>
    <div class="my-3">
        <!-- Add new enumObject.values Item -->
        <div class="btn-add" @click="setShownEnumItemForm(true)">
            <div class="btn-add__plus"></div>
            <div class="btn-add__text">Добавить позицию</div>
        </div>
        <div v-if="isShownEnumItemForm" class="block-position__item block-position__item--edit">
            <Form @submit="addEnumsItem" :validation-schema="newEnumItemSchema">
                <Field type="text" name="title" class="block-position__title" />
                <div class="block-position__btns">
                    <button class="btn-edit-sm btn-success">
                        <svg class="icon icon-check">
                            <use xlink:href="img/svg/sprite.svg#check"></use>
                        </svg>
                    </button>
                    <div
                        style="margin-left: 4px"
                        class="btn-edit-sm btn-danger"
                        @click.prevent.stop="setShownEnumItemForm(false)"
                    >
                        <svg class="icon icon-close">
                            <use xlink:href="img/svg/sprite.svg#close"></use>
                        </svg>
                    </div>
                </div>
            </Form>
        </div>
    </div>
    <div class="block-position" v-if="enumObject">
        <div class="block-position__item" v-for="item in enumObject.values" :key="item.name">
            <div class="block-position__title">{{ item.title }}</div>
            <div class="block-position__btns">
                <div @click="setItemToChangeId(item.id)" class="btn-edit-sm btn-secondary">
                    <svg class="icon icon-edit">
                        <use xlink:href="img/svg/sprite.svg#edit"></use>
                    </svg>
                </div>
                <div @click="setEnumItemToRemove(item)" class="btn-edit-sm btn-danger">
                    <svg class="icon icon-basket">
                        <use xlink:href="img/svg/sprite.svg#basket"></use>
                    </svg>
                </div>
            </div>

            <!-- Change enum item Form -->
            <div
                v-show="itemToChangeId === item.id"
                class="block-position__item block-position__item--edit change-enum-item__form"
            >
                <Form @submit="changeEnumsItem" :validation-schema="newEnumItemSchema">
                    <Field type="text" name="title" class="block-position__title" />
                    <div class="block-position__btns">
                        <button class="btn-edit-sm btn-success">
                            <svg class="icon icon-check">
                                <use xlink:href="img/svg/sprite.svg#check"></use>
                            </svg>
                        </button>
                        <div
                            style="margin-left: 4px"
                            class="btn-edit-sm btn-danger"
                            @click.prevent.stop="setShownEnumItemForm(false)"
                        >
                            <svg @click="setItemToChangeId('')" class="icon icon-close">
                                <use xlink:href="img/svg/sprite.svg#close"></use>
                            </svg>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </div>

    <!-- Remove enumItem alert -->
    <div class="mock-modal__wrapper" v-show="isRemoveAlertVisible">
        <div class="mock-modal__cont">
            <div class="mock-modal__header">
                <span
                    >Уверены, что хотите удалить позицию
                    <b> {{ enumItemToRemove?.title }}</b>
                </span>

                <b class="mock-modal__closer" @click="setRemoveAlertVisible(false)">x</b>
            </div>
            <div class="mock-modal__buttons">
                <button class="btn btn-danger" @click="removeEnumItem(enumObject, enumItemToRemove.id)">Удалить</button>
                <button class="btn" @click="setRemoveAlertVisible(false)">Отменить</button>
            </div>
        </div>
    </div>
</template>

<script>
import {onMounted, ref, watch, toRefs} from 'vue';
import enumsService from '@/services/enums.service';
import {Form, Field} from 'vee-validate';
import * as yup from 'yup';
export default {
    components: {
        Form,
        Field,
    },
    props: {
        enumId: {
            type: String || null,
        },
    },
    setup(props) {
        const {enumId} = toRefs(props);
        const enumObject = ref(null);
        const newEnumItemSchema = yup.object().shape({
            title: yup.string().required('Введите название справочника'),
        });

        onMounted(async () => {
            await updateEnumObject(enumId.value);
        });
        watch(enumId, async () => {
            await updateEnumObject(enumId.value);
        });

        const isShownEnumItemForm = ref(false);
        const setShownEnumItemForm = (bool) => {
            isShownEnumItemForm.value = bool;
        };
        const updateEnumObject = async (id) => {
            try {
                enumObject.value = await enumsService.getEnumsObject(id);
            } catch (e) {
                console.log(e.message);
            }
        };
        const addEnumsItem = async (title, actions) => {
            try {
                enumObject.value = await enumsService.addEnumsItem(enumObject.value, title);
                actions.resetForm();
            } catch (e) {
                console.log(e.message);
            }
        };
        // Remove EnumItem__________________________
        const isRemoveAlertVisible = ref(false);
        const setRemoveAlertVisible = (bool) => {
            isRemoveAlertVisible.value = bool;
        };
        const enumItemToRemove = ref(null);
        const setEnumItemToRemove = (item) => {
            enumItemToRemove.value = item;
            setRemoveAlertVisible(true);
        };
        const removeEnumItem = async (myEnum, enumItemId) => {
            try {
                enumObject.value = await enumsService.removeEnumsItem(myEnum, enumItemId);
                setRemoveAlertVisible(false);
            } catch (e) {
                console.log(e.message);
            }
        };
        // Change EnumItem______________________________
        const itemToChangeId = ref('');
        const setItemToChangeId = (newId) => {
            itemToChangeId.value = newId;
        };

        return {
            newEnumItemSchema,
            addEnumsItem,
            removeEnumItem,
            isShownEnumItemForm,
            setShownEnumItemForm,
            updateEnumObject,
            enumObject,
            enumItemToRemove,
            setEnumItemToRemove,
            isRemoveAlertVisible,
            setRemoveAlertVisible,
            itemToChangeId,
            setItemToChangeId,
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
.change-enum-item__form {
    position: absolute;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
}
</style>
