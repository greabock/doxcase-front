<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li v-for="(item, i) of list" :key="i" class="breadcrumb-item" itemprop="itemListElement">
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
