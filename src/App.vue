<template>
    <router-view name="header"></router-view>
    <router-view></router-view>
    <router-view name="footer"></router-view>
    <MenuAssistant></MenuAssistant>
</template>

<script>
import MenuAssistant from '@/components/MenuAssistant';
export default {
    name: 'App',
    components: {MenuAssistant},
};
</script>
<style></style>
