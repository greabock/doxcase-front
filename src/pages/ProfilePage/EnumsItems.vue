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
                    <use xlink:href="/img/svg/sprite.svg#search"></use>
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
                    <button
                        :ref="addEnumItemButton"
                        class="btn-edit-sm btn-success"
                    >
                        <svg class="icon icon-check">
                            <use xlink:href="/img/svg/sprite.svg#check"></use>
                        </svg>
                    </button>
                    <div
                        style="margin-left: 4px"
                        class="btn-edit-sm btn-danger"
                        @click.prevent.stop="setShownEnumItemForm(false)"
                    >
                        <svg class="icon icon-close">
                            <use xlink:href="/img/svg/sprite.svg#close"></use>
                        </svg>
                    </div>
                </div>
            </Form>
        </div>
    </div>
    <div class="block-position" v-if="enumObject">
        <div class="block-position__item" v-for="item in searchedAndFilteredEnums" :key="item.name">
            <div class="block-position__title">{{ item?.title }}</div>
            <div class="block-position__btns">
                <div @click="setItemToChange(item)" class="btn-edit-sm btn-secondary">
                    <svg class="icon icon-edit">
                        <use xlink:href="/img/svg/sprite.svg#edit"></use>
                    </svg>
                </div>
                <div @click="setEnumItemToRemove(item)" class="btn-edit-sm btn-danger">
                    <svg class="icon icon-basket">
                        <use xlink:href="/img/svg/sprite.svg#basket"></use>
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
                                <use xlink:href="/img/svg/sprite.svg#check"></use>
                            </svg>
                        </button>
                        <div
                            style="margin-left: 4px"
                            class="btn-edit-sm btn-danger"
                            @click.prevent.stop="setShownEnumItemForm(false); setItemToChange(null)"
                        >
                            <svg class="icon icon-close">
                                <use xlink:href="/img/svg/sprite.svg#close"></use>
                            </svg>
                        </div>
                    </div>
                </Form>
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
            <h3>Удаление позиции</h3>
        </div>
        <span>
            Вы действительно хотите удалить позицию "{{ enumItemToRemove?.title }}" из справочника
            "{{ enumObject?.title}}"?
            </span>
        <div class="modal-window__buttons">
            <v-button class="w-100" @click="removeEnumItem(enumObject, enumItemToRemove.id)">Удалить</v-button>
            <v-button :outline="true" class="w-100" @click="setRemoveAlertVisible(false)">Отменить</v-button>
        </div>
    </modal-window>
</template>

<script>
import VButton from '@/ui/VButton';
import {onMounted, ref, watch, toRefs, computed} from 'vue';
import enumsService from '@/services/enums.service';
import {Form, Field} from 'vee-validate';
import * as yup from 'yup';
import ModalWindow from '@/components/ModalWindow';

export default {
    components: {
        Form,
        Field,
        VButton,
        ModalWindow,
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
        const searchedAndFilteredEnums = computed(() => {
            if (enumObject.value) {
                return [...enumObject.value.values]
                    .filter((enumItem) => enumItem.title.toLowerCase().includes(searchValue.value.toLowerCase()))
                    .sort((a,b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1);
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

        const addEnumItemButton = ref(null);
        const addEnumsItem = async (title, actions) => {
            try {
                enumObject.value = await enumsService.addEnumsItem(enumObject.value, title);
                addEnumItemButton.value?.focus();
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
            itemToChangeFieldValue.value = item?.title || '';
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
            searchedAndFilteredEnums,
            enumItemToRemove,
            setEnumItemToRemove,
            isRemoveAlertVisible,
            setRemoveAlertVisible,
            itemToChange,
            setItemToChange,
            changeEnumItemSchema,
            changeEnumsItem,
            itemToChangeFieldValue,
            addEnumItemButton,
        };
    },
};
</script>

<style scoped>
INPUT::placeholder {
    color: #d6d6d6;
}
.change-enum-item__form {
    position: absolute;
    background-color: #fff;
    z-index: 10;
    top: -10px;
    right: 0;
    left: 0;
}
.block-position__item {
    margin-top: 10px;
}
</style>
