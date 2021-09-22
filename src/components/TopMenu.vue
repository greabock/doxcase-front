<template>
    <div
        class="menu-with-dropdown">
        <ul
            class="menu"
            ref='ulBlock'
        >
            <li
                v-for="section in sectionsInHeader"
                :key="section?.id"
                @click="$emit('toggleIsMobileActive')"
            >
                <router-link
                    :class="{active: `/search/${section.id}` === $route.path}"
                    :to="`/search/${section.id}`"
                >
                    {{ section?.title }}
                </router-link>
            </li>
        </ul>
        <div
            v-if="sectionsInDropdown?.length"
            class="menu-with-dropdown__block"
            :style="{left: dotsLeft + 'px'}"
        >
            <div
                @click.stop="() => isDropdownShow = !isDropdownShow"
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
                    :key="section?.id"
                >
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
import {onMounted, onUnmounted, ref, watch} from 'vue';
import { debounce } from 'lodash';

export default {
props: {
    sectionsInHeader: {
        type: Array,
        default: () => []
    }
},
    emits: ['updateIsDropdownShow'],
setup(props, {emit}) {

    const sectionsInDropdown = ref([]);
    const ulBlock = ref(null);
    const isDropdownShow = ref(false);
    const dotsLeft = ref(0);

    const linksHandler = debounce(() => {
        const blockWidth = ulBlock.value.getBoundingClientRect().width;
        let dropdownArr = [];
        let linksWidth = 0;

        ulBlock.value.children.forEach((li, i) => {
            linksWidth += li.getBoundingClientRect().width;

            if (linksWidth > blockWidth) {
                dropdownArr.push(props.sectionsInHeader[i]);
            } else {
                dotsLeft.value = linksWidth;
            }
        });
        sectionsInDropdown.value = dropdownArr;
    }, 500);

    // watch(dotsLeft, (newVal) => {
    //     document.querySelector('.menu-with-dropdown__block').style.left = newVal + 'px';
    // });

    const closeDropdown = (e) => {
        if (!ulBlock.value.contains(e.target)) {
            isDropdownShow.value = false;
        }
    };

    watch(isDropdownShow, (newVal) => {
        emit('updateIsDropdownShow', newVal);
    });
    onMounted(() => {
        window.addEventListener('resize', linksHandler);
        global.addEventListener('click', closeDropdown);
        linksHandler();
    });
    onUnmounted(() => {
        window.removeEventListener('resize', linksHandler);
        global.removeEventListener('click', closeDropdown);
    })
    return {
        ulBlock,
        sectionsInDropdown,
        isDropdownShow,
        dotsLeft,
    }
}
};
</script>

<style scoped>
.menu {
    margin: 0;
}

@media (min-width: 992px) {
    .menu {
        height: 44px;
        overflow:hidden;
    }
}

.menu-with-dropdown {
    padding-right: 1.2rem;
}

.menu-with-dropdown__block {
    z-index: 10;
    position: absolute;
    top: 0;
    background-color: #fff;
}
.menu li {
    overflow: hidden
}
.menu li A {
    overflow: hidden
}
</style>