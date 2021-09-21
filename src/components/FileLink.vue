<template>
    <router-link :to="`/file-link/${href}`" :target="target">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
    props: {
        href: String,
        target: String,
    }
}
</script>