<template>
    <div>Profile</div>
    <ul>
        <li>
            <router-link :to="{name: 'home'}">Home</router-link>
        </li>
        <li>
            <router-link :to="{name: 'login'}">Login</router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Profile',
    components: {},
};
</script>

<style></style>
