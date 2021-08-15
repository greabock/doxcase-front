<template>
    <div v-if="enumObject" class="h3 mb-3">{{ enumObject?.title }}</div>
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
                <Field type="text" name="title" placeholder="Новая позиция" class="block-position__title" />
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
        <div class="block-position__item" v-for="item in searchedEnums" :key="item.name">
            <div class="block-position__title">{{ item?.title }}</div>
            <div class="block-position__btns">
                <div @click="setItemToChange(item)" class="btn-edit-sm btn-secondary">
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
                v-show="itemToChange?.id === item.id"
                class="block-position__item block-position__item--edit change-enum-item__form"
            >
                <Form @submit="changeEnumsItem" :validation-schema="changeEnumItemSchema">
                    <Field type="text" name="title" class="block-position__title" v-model="itemToChangeFieldValue" />
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
                            <svg @click="setItemToChange(null)" class="icon icon-close">
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
            <b class="mock-modal__closer" @click="setRemoveAlertVisible(false)">x</b>
            <div class="mock-modal__header">
                <h3>Удаление позиции</h3>
            </div>
            <span
                >Вы действительно хотите удалить позицию "{{ enumItemToRemove?.title }}" из справочника "{{
                    enumObject?.title
                }}"?
            </span>
            <div class="mock-modal__buttons">
                <v-button class="w-100" @click="removeEnumItem(enumObject, enumItemToRemove.id)">Удалить</v-button>
                <v-button :outline="true" class="w-100" @click="setRemoveAlertVisible(false)">Отменить</v-button>
            </div>
        </div>
    </div>
</template>

<script>
import VButton from '@/ui/VButton';
import {onMounted, ref, watch, toRefs, computed} from 'vue';
import enumsService from '@/services/enums.service';
import {Form, Field} from 'vee-validate';
import * as yup from 'yup';
export default {
    components: {
        Form,
        Field,
        VButton,
    },
    props: {
        enumId: {
            type: String || null,
        },
    },
    setup(props) {
        const {enumId} = toRefs(props);
        const enumObject = ref(null);
        const searchValue = ref('');
        const searchedEnums = computed(() => {
            if (enumObject.value) {
                return [...enumObject.value.values].filter((enumItem) => {
                    return enumItem.title.toLowerCase().includes(searchValue.value.toLowerCase());
                });
            }
            return [];
        });
        const newEnumItemSchema = yup.object().shape({
            title: yup.string().required('Введите название позиции'),
        });
        const changeEnumItemSchema = yup.object().shape({
            title: yup.string().required('Введите название позиции'),
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
            setItemToChange(null);
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
        const itemToChangeFieldValue = ref('');
        const itemToChange = ref(null);
        const setItemToChange = (item) => {
            itemToChange.value = item;
            itemToChangeFieldValue.value = item?.title;
        };
        const changeEnumsItem = async (title, actions) => {
            try {
                enumObject.value = await enumsService.changeEnumsItem(enumObject.value, itemToChange.value, title);
                actions.resetForm();
                setItemToChange(null);
            } catch (e) {
                console.log(e.message);
            }
        };

        return {
            searchValue,
            newEnumItemSchema,
            addEnumsItem,
            removeEnumItem,
            isShownEnumItemForm,
            setShownEnumItemForm,
            updateEnumObject,
            enumObject,
            searchedEnums,
            enumItemToRemove,
            setEnumItemToRemove,
            isRemoveAlertVisible,
            setRemoveAlertVisible,
            itemToChange,
            setItemToChange,
            changeEnumItemSchema,
            changeEnumsItem,
            itemToChangeFieldValue,
        };
    },
};
</script>

<style scoped>
INPUT::placeholder {
    color: #d6d6d6;
}
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
    position: relative;
    flex-direction: column;
    width: 400px;
    background-color: #fff;
    padding: 32px;
    border-radius: 5px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
}
.mock-modal__header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
}
.mock-modal__closer {
    display: block;
    position: absolute;
    font-size: 26px;
    line-height: 26px;
    top: 15px;
    right: 20px;
    cursor: pointer;
}
.mock-modal__buttons {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
.mock-modal__buttons button:first-child {
    margin-right: 5px;
}
.change-enum-item__form {
    position: absolute;
    z-index: 100;
    top: -10px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
}
.block-position__item {
    margin-top: 10px;
}
</style>
