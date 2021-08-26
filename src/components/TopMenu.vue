<template>
    <div
        v-if="sectionsInHeader?.length"
        class="menu-with-dropdown">
        <ul
            class="menu"
            ref='ulBlock'
        >
            <li
                v-for="section in sectionsInHeader"
                :key="section?.id">
                <router-link
                    :class="{active: `/search/${section.id}` === $route.path}"
                    :to="'/search/' + section?.id">
                    {{ section?.title }}
                </router-link>
            </li>
        </ul>
        <div class="menu-with-dropdown__block">
            <div
                @click="() => isDropdownShow = !isDropdownShow"
                class="menu-with-dropdown__toggle d-none d-lg-block">
                <svg class="icon icon-dots ">
                    <use xlink:href="/img/svg/sprite.svg#dots"></use>
                </svg>
            </div>
            <ul
                v-show="isDropdownShow"
                class="menu-with-dropdown__dropdown">
                <li
                    v-for="section in sectionsInDropdown"
                    :key="section?.id">
                    <router-link
                        :class="{active: `/search/${section?.id}` === $route.path}"
                        :to="'/search/' + section?.id">
                        {{ section?.title }}
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {onUpdated, onMounted, onBeforeUnmount, ref} from 'vue';

export default {
props: {
    sectionsInHeader: {
        type: Array,
        default: () => []
    }
},
setup(props) {

    const sectionsInDropdown = ref([]);
    const ulBlock = ref(null);
    const isDropdownShow = ref(false);

    const linksHandler = () => {
        const blockWidth = ulBlock.value.clientWidth;
        let dropdownArr = [];
        let linksWidth = 0;

        ulBlock.value.children.forEach((li, i) => {
            linksWidth += li.clientWidth;
            if (linksWidth > blockWidth) {
                dropdownArr.push(props.sectionsInHeader[i]);
            }
        });
        sectionsInDropdown.value = dropdownArr;
    };
    onMounted(() => {
        window.addEventListener('resize', linksHandler);
    });
    onUpdated(() => {
        linksHandler();
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', linksHandler);
    });
    return {
        ulBlock,
        sectionsInDropdown,
        isDropdownShow,
    }
}
};
</script>

<style scoped>
@media (min-width: 992px) {
    .menu {
        height: 44px;
        overflow:hidden;
    }
}
</style>