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
import '@/css/main.css';

export default {
    name: 'App',
    components: {MenuAssistant},
};
</script>

