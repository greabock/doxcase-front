<template>
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
    </div>
</template>
<script>
import {onMounted, ref} from 'vue';
import enumsService from '@/services/enums.service';

export default {
    setup() {
        const enums = ref([]);
        onMounted(async () => {
            try {
                enums.value = await enumsService.getEnums();
            } catch (e) {
                console.log(e.message);
            }
        });
        return {
            enums,
        };
    },
};
</script>

<style scoped></style>
