<template>
    <!-- <h1>Создание нового материала</h1> -->
    <main class="main-block">
        <div class="container-fluid">
            <VBreadcrumb
                :list="[
                    {
                        link: '/',
                        name: 'Главная',
                    },
                    {
                        name: 'Создать новый материал',
                    },
                ]"
            />
        </div>
        <!-- start sNewMaterial-->
        <div class="sNewMaterial section" id="sNewMaterial">
            <div class="container-fluid">
                <div class="row pb-2">
                    <div class="col">
                        <h1>Новый материал</h1>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Выберите раздел</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VSelect
                                        class="input-line__input"
                                        :options="[
                                            {
                                                key: 1,
                                                name: 'placeholder 1',
                                            },
                                        ]"
                                        placeholder="О Сервисе"
                                    />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Название материала</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VInput class="input-line__input" placeholder="Введите" />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Выберите категорию</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VSelect
                                        class="input-line__input"
                                        :options="[
                                            {
                                                key: 1,
                                                name: 'placeholder 1',
                                            },
                                        ]"
                                        placeholder="ФГУП Почта России"
                                    />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Выберите категорию</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VSelect
                                        class="input-line__input"
                                        :options="[
                                            {
                                                key: 1,
                                                name: 'placeholder 1',
                                            },
                                        ]"
                                        placeholder="ФГУП Почта России"
                                    />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Краткое поле</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VInput class="input-line__input" placeholder="Введите" />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Дата возникновения компании</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VDatePicker placeholder="ДД.ММ.ГГГГ" class="input-line__input" />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Большое поле</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <textarea
                                        class="input-line__input form-control"
                                        name="textarea"
                                        placeholder="Введите"
                                    ></textarea>
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Чекбоксы</div>
                            </div>
                            <div class="col">
                                <label class="custom-input form-check"
                                    ><input
                                        class="custom-input__input form-check-input"
                                        name="checkbox"
                                        type="checkbox"
                                    /><span class="custom-input__text form-check-label">Следующий чекбокс</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="row">
                            <div class="col-md-auto">
                                <div class="input-line__title">Вики-редактор</div>
                            </div>
                            <div class="col">
                                <div class="input-line__input-wrap form-group">
                                    <VTextEditor class="text-area" v-model="html" />
                                </div>
                                <!-- +e.input-wrap-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end sNewMaterial-->
        <!-- start sAddDocs-->
        <section class="sAddDocs section" id="sAddDocs">
            <div class="container-fluid">
                <h2>Работа с документами</h2>
                <ul class="nav nav-tabs">
                    <li class="nav-item"><a class="nav-link" href="#">Справочники</a></li>
                    <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Пользователи</a></li>
                </ul>
            </div>
            <div class="sAddDocs__body bg-white pt-3">
                <div class="container-fluid pb-3">
                    <VButtonFileLoader @upload="loadFiles">
                        <div class="btn-add">
                            <div class="btn-add__plus"></div>
                            <div class="btn-add__text">Добавить документ</div>
                        </div>
                    </VButtonFileLoader>
                </div>
                <div v-for="(item, i) of listReverse" :key="item.key">
                    <ItemEdit
                        v-if="item.isEdit"
                        :file="item.file"
                        :data="item.data"
                        @save="(file) => saveFile(item, file)"
                        @close="item.isEdit = false"
                    />
                    <ItemFile v-else @edit="editFile(item)" @delete="deleteFile(i)" :file="item.file" :data="item.data" />
                </div>
            </div>
            <div class="sAddDocs__footer">
                <div class="container-fluid d-flex">
                    <VButton class="w-auto"> Сохранить изменения </VButton>
                    <VButton class="ms-2" outline> Отмена </VButton>
                </div>
            </div>
        </section>
        <!-- end sAddDocs-->
    </main>
</template>

<script>
import VBreadcrumb from '@/ui/VBreadcrumb';
import VSelect from '@/ui/VSelect';
import VInput from '@/ui/VInput';
import VDatePicker from '@/ui/VDatePicker';
import VTextEditor from '@/ui/VTextEditor';
import VButton from '@/ui/VButton';
import VButtonFileLoader from '@/ui/VButtonFileLoader';

import ItemEdit from './ItemEdit';
import ItemFile from './ItemFile';
import {ref} from '@vue/reactivity';
import { computed } from '@vue/runtime-core';

const getFileData = (file) => {
    const {size, name, type} = file;
    const kb = size / 1024;
    const mb = kb / 1024;

    const n = name.split('.');
    const t = n.splice(-1);
    const fileName = n.length ? n.join(): t.join();

    const fileType = type.split('/').splice(-1).join();

    return {
        size: mb > 0 ? `${kb.toFixed(2)} kb` : `${mb.toFixed(2)} mb`,
        name: fileName,
        type: fileType,
    };
};

export default {
    components: {
        VBreadcrumb,
        VSelect,
        VInput,
        VDatePicker,
        VTextEditor,
        VButton,
        VButtonFileLoader,
        ItemEdit,
        ItemFile,
    },
    setup() {
        const listFiles = ref([]);

        const saveFile = (item, file) => {
            item.isEdit = false;
            item.file = file;
            item.data = getFileData(file);
        };

        const editFile = (item) => {
            listFiles.value.map(item => item.isEdit = false);
            item.isEdit = true;
        };

        const deleteFile = (i) => {
            listFiles.value.splice(i, 1);
        };

        const loadFiles = ([file]) => {
            listFiles.value.map(item => item.isEdit = false)
            listFiles.value.push(
                 {
                    key: new Date(),
                    isEdit: true,
                    file,
                    data: getFileData(file),
                }
            )
        };

        const listReverse = computed(() => listFiles.value.reverse());

        const html = ref('');
        return {
            listReverse,
            html,
            listFiles,
            saveFile,
            editFile,
            deleteFile,
            loadFiles,
        };
    },
};
</script>

<style scoped>
.text-area {
    max-width: 863px;
    min-height: 152px;
}
</style>
