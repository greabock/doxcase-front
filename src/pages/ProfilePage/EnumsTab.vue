<template>
    <!-- Enums block -->
    <div class="btns-group-sm">
        <button v-for="item in enums" @click="updateEnumObject(item)" class="btn-filter" :key="item?.id">
            {{ item?.title }}
            <svg @click.stop="removeEnum(item.id)" class="icon icon-close">
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
    <div class="h3 mb-3">{{}}</div>
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
        <div class="btn-add">
            <div class="btn-add__plus"></div>
            <div class="btn-add__text">Добавить позицию</div>
        </div>
    </div>
    <div class="block-position">
        <div class="block-position__item" v-for="item in enumObject.values" :key="item.name">
            <div class="block-position__title">{{ item.title }}</div>
            <div class="block-position__btns">
                <div class="btn-edit-sm btn-secondary">
                    <svg class="icon icon-edit">
                        <use xlink:href="img/svg/sprite.svg#edit"></use>
                    </svg>
                </div>
                <div class="btn-edit-sm btn-danger">
                    <svg class="icon icon-basket">
                        <use xlink:href="img/svg/sprite.svg#basket"></use>
                    </svg>
                </div>
            </div>
        </div>
        <div class="block-position__item block-position__item--edit">
            <div class="block-position__title" contenteditable="true">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </div>
            <div class="block-position__btns">
                <div class="btn-edit-sm btn-success">
                    <svg class="icon icon-check">
                        <use xlink:href="img/svg/sprite.svg#check"></use>
                    </svg>
                </div>
                <div class="btn-edit-sm btn-danger">
                    <svg class="icon icon-close">
                        <use xlink:href="img/svg/sprite.svg#close"></use>
                    </svg>
                </div>
            </div>
        </div>
        <div class="mock-modal__wrapper" v-show="isModalVisible">
            <div class="mock-modal__cont">
                <div class="mock-modal__header">
                    <span>Новый справочник</span> <b class="mock-modal__closer" @click="setModalVisible(false)">x</b>
                </div>
                <div class="mock-modal__form">
                    <Form @submit="addNewEnum" :validation-schema="schema">
                        <div class="form-wrap__input-wrap form-group">
                            <Field
                                name="title"
                                type="text"
                                class="form-wrap__input form-control"
                                placeholder="Название справончика"
                            />
                            <ErrorMessage name="enumName" class="error-feedback" />
                        </div>
                        <button class="btn btn-primary w-100">
                            <span>Добавить</span>
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {onMounted, ref} from 'vue';
import enumsService from '@/services/enums.service';
import {Form, Field, ErrorMessage} from 'vee-validate';
import * as yup from 'yup';

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    setup() {
        const enums = ref([]);
        const enumObject = ref('');
        const schema = yup.object().shape({
            title: yup.string().required('Введите название справочника'),
        });

        onMounted(async () => {
            try {
                enums.value = await enumsService.getEnums();
                if (enums.value.length !== 0) {
                    enumObject.value = await enumsService.getEnumsItems(enums.value[0].id);
                }
            } catch (e) {
                console.log(e.message);
            }
        });
        // Enums ___________________________________________________________
        const isModalVisible = ref(false);
        const setModalVisible = (bool) => {
            isModalVisible.value = bool;
        };
        const addNewEnum = async (name) => {
            try {
                const newEnum = await enumsService.createEnum(name);
                enums.value = [...enums.value, newEnum];
                setModalVisible(false);
            } catch (e) {
                console.log(e.message);
                setModalVisible(false);
            }
        };
        const removeEnum = async (id) => {
            try {
                await enumsService.removeEnum(id);
                enums.value = [...enums.value].filter((item) => item.id !== id);
            } catch (e) {
                console.log(e.message);
            }
        };
        // Enum ITEMS _________________________________________________________
        const updateEnumObject = async (item) => {
            try {
                enumObject.value = await enumsService.getEnumsItems(item.id);
            } catch (e) {
                console.log(e.message);
            }
        };

        return {
            enums,
            enumObject,
            isModalVisible,
            setModalVisible,
            schema,
            addNewEnum,
            updateEnumObject,
            removeEnum,
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
    width: 350px;
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
</style>
