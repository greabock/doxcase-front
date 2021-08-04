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
                <div class="btn-edit-sm btn-secondary">
                    <svg class="icon icon-edit">
                        <use xlink:href="img/svg/sprite.svg#edit"></use>
                    </svg>
                </div>
                <div @click="removeEnumItem(enumObject, item.id)" class="btn-edit-sm btn-danger">
                    <svg class="icon icon-basket">
                        <use xlink:href="img/svg/sprite.svg#basket"></use>
                    </svg>
                </div>
            </div>
        </div>

        <div class="block-position__item block-position__item--edit"></div>
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
        const addEnumsItem = async (title) => {
            try {
                enumObject.value = await enumsService.addEnumsItem(enumObject.value, title);
            } catch (e) {
                console.log(e.message);
            }
        };
        const removeEnumItem = async (myEnum, enumItemId) => {
            try {
                enumObject.value = await enumsService.removeEnumsItem(myEnum, enumItemId);
            } catch (e) {
                console.log(e.message);
            }
        };
        onMounted(async () => {
            console.log(enumId.value);
            await updateEnumObject(enumId.value);
        });
        watch(enumId, async () => {
            console.log(enumId.value);
            await updateEnumObject(enumId.value);
        });

        return {
            newEnumItemSchema,
            addEnumsItem,
            removeEnumItem,
            isShownEnumItemForm,
            setShownEnumItemForm,
            updateEnumObject,
            enumObject,
        };
    },
};
</script>

<style scoped></style>
