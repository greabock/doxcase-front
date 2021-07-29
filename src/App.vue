<template>
    <router-view name="header"></router-view>
    <router-view></router-view>

    <div class="container">
        <div class="aside-left">
            <router-view name="asideLeft"></router-view>
        </div>
        <div class="content-right">
            <router-view name="contentRight"></router-view>
        </div>
    </div>

    <router-view name="footer"></router-view>

    <menu-assistant />
</template>

<script>
import menuAssistant from '@/components/menuAssistant';
export default {
    name: 'App',
    components: {menuAssistant},
};
</script>
<style>
.container {
    display: flex;
}
.aside-left {
    width: 30%;
}
.content-right {
    width: 70%;
}
</style>
