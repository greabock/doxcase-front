<template>
    <div class="main-wrapper">
        <router-view name="header"></router-view>
        <router-view></router-view>
        <router-view name="footer"></router-view>
        <MenuAssistant></MenuAssistant>
    </div>
</template>

<script>
import MenuAssistant from '@/components/MenuAssistant';
export default {
    name: 'App',
    components: {MenuAssistant},
};
</script>
<style>
@import '../public/css/main.min.css';
</style>
