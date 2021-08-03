<template>
    <main class="main-block d-flex">
        <!-- start sCabinet-->
        <section class="sCabinet section py-0" id="sCabinet">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-aside col-lg-auto">
                        <!-- start sCabinetAside-->
                        <user-profile-aside :user="user"></user-profile-aside>
                        <!-- end sCabinetAside-->
                    </div>
                    <div class="col col--main">
                        <!-- start sCabinetMain-->
                        <div class="sCabinetMain section" id="sCabinetMain">
                            <div class="sCabinetMain__head">
                                <div class="h3">Редактирование</div>
                            </div>
                            <ul class="nav nav-tabs">
                                <li class="nav-item">
                                    <span
                                        @click.prevent="switchPageContent('guides')"
                                        class="nav-link"
                                        :class="{active: pageContent === 'guides'}"
                                        >Справочники</span
                                    >
                                </li>
                                <li class="nav-item">
                                    <span
                                        @click.prevent="switchPageContent('users')"
                                        class="nav-link"
                                        :class="{active: pageContent === 'users'}"
                                        >Пользователи
                                    </span>
                                </li>
                            </ul>
                            <div v-show="pageContent === 'guides'" class="sCabinetMain__body">
                                <!-- Enums block -->
                                <div class="btns-group-sm">
                                    <button v-for="item in enums" class="btn-filter" :key="item?.id">
                                        {{ item?.title }}
                                        <svg class="icon icon-close">
                                            <use xlink:href="img/svg/sprite.svg#close"></use>
                                        </svg>
                                    </button>
                                </div>
                                <div class="mb-4">
                                    <div class="btn-add">
                                        <div class="btn-add__plus"></div>
                                        <div class="btn-add__text">Добавить справочник</div>
                                    </div>
                                </div>
                                <div class="h3 mb-3">Отрасли</div>
                                <div class="search-block">
                                    <form>
                                        <div class="search-block__input-wrap form-group">
                                            <input
                                                class="search-block__input form-control"
                                                name="text"
                                                type="text"
                                                placeholder="Поиск"
                                            />
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
                                    <div class="block-position__item">
                                        <div class="block-position__title">Государственные организации</div>
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
                                    <div class="block-position__item">
                                        <div class="block-position__title">Банки</div>
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
                                    <div class="block-position__item">
                                        <div class="block-position__title">Страховые организации</div>
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
                                    <div class="block-position__item">
                                        <div class="block-position__title">Позиция</div>
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
                                    <div class="block-position__item">
                                        <div class="block-position__title">Ритейл</div>
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
                                </div>
                            </div>
                            <div v-show="pageContent === 'users'" class="sCabinetMain__body">
                                <div class="mb-3">
                                    <div class="search-block">
                                        <form>
                                            <div class="search-block__input-wrap form-group">
                                                <input
                                                    class="search-block__input form-control"
                                                    name="text"
                                                    type="text"
                                                    placeholder="Поиск"
                                                />
                                            </div>
                                            <!-- +e.input-wrap-->
                                            <button class="search-block__btn" type="submit">
                                                <svg class="icon icon-search">
                                                    <use xlink:href="img/svg/sprite.svg#search"></use>
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>ФИО</th>
                                                <th>Роль</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="user in usersList" :key="user?.id">
                                                <td class="fw-500">{{ user.name }}</td>
                                                <td>
                                                    <div class="sCabinetMain__input-wrap form-group">
                                                        <select
                                                            class="sCabinetMain__input form-select select-small"
                                                            name="select"
                                                        >
                                                            <option value="Администратор">Администратор</option>
                                                            <option value=" placeholder 1">Модератор</option>
                                                            <option value=" placeholder 2">Пользователь</option>
                                                        </select>
                                                    </div>
                                                    <!-- +e.input-wrap-->
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="sCabinetMain__footer">
                                <button class="btn btn-primary">
                                    Сохранить <span class="d-none d-sm-inline">изменения</span>
                                </button>
                                <button class="btn btn-outline-primary ms-2">Отмена</button>
                            </div>
                        </div>
                        <!-- end sCabinetMain-->
                    </div>
                </div>
            </div>
        </section>
        <!-- end sCabinet-->
    </main>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useAuth} from '@/hooks/useAuth';
import AuthService from '@/services/auth.service';
import UserProfileAside from '@/pages/ProfilePage/UserProfileAside';
import enumsService from '@/services/enums.service';
import usersService from '@/services/users.service';
export default {
    name: 'ProfilePage',
    components: {
        UserProfileAside,
    },
    setup() {
        const pageContent = ref('guides');
        const user = ref(null);
        const enums = ref([]);
        const usersList = ref([]);
        const {handleLogout} = useAuth();
        function switchPageContent(to) {
            pageContent.value = to;
        }
        onMounted(async () => {
            try {
                user.value = await AuthService.getUserInfo();
                enums.value = await enumsService.getEnums();
                usersList.value = await usersService.getUsers();
                console.log(usersList.value.length);
            } catch (e) {
                console.log(e.message);
            }
        });
        return {
            handleLogout,
            pageContent,
            switchPageContent,
            user,
            enums,
            usersList,
        };
    },
};
</script>

<style scoped></style>
