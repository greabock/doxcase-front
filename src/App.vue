<template>
    <div class="main-wrapper">
        <router-view name="header"></router-view>
        <router-view></router-view>
        <router-view name="footer"></router-view>
    </div>
</template>

<script>
import '@/css/main.css';

export default {
    name: 'App',
};
</script>

