<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb" itemscope="itemscope" itemtype="http://schema.org/BreadcrumbList">
            <li
                v-for="(item, i) of list"
                :key="i"
                class="breadcrumb-item"
                itemprop="itemListElement"
                itemscope="itemscope"
                itemtype="http://schema.org/ListItem"
            >
                <a :href="item.link" itemprop="item">
                    <span itemprop="name">{{ item.name }}</span>
                    <meta itemprop="position" :content="i + 1"
                /></a>
            </li>
        </ol>
    </nav>
</template>

<script>
export default {
    props: {
        list: Array,
    },
    setup() {},
};
</script>
