<template>
    <div>Home</div>
    <ul>
        <li>
            <router-link :to="{name: 'login'}">Login</router-link>
        </li>
        <li>
            <router-link :to="{name: 'profile'}">Profile</router-link>
        </li>
    </ul>
    <list></list>
</template>

<script>
import List from './components/List';
export default {
    name: 'Home',
    components: {
        List,
    },
};
</script>

<style></style>
