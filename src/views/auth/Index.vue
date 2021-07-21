<template>
    <div>Login</div>
    <ul>
        <li>
            <router-link :to="{name: 'home'}">Home</router-link>
        </li>
        <li>
            <router-link :to="{name: 'profile'}">Profile</router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Login',
    components: {},
};
</script>

<style></style>
