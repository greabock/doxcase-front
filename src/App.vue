<template>
    <div class="main-wrapper">
        <notifications width="25rem" position="bottom right"  />
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

