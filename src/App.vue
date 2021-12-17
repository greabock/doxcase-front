<template>
    <div class="main-wrapper">
        <notifications width="25rem" position="top right"  />
        <router-view name="header"></router-view>
        <router-view></router-view>
        <router-view name="footer"></router-view>
    </div>
</template>

<script>
import '@/css/main.min.css';

export default {
    name: 'App',
};
</script>
<style>
    .btn-secondary {
        border-color: #ddd;
    }
    .btn-secondary:hover {
        border-color: #ddd;
    }
</style>

