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
    <button @click="logout">Logout</button>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'Profile',
    components: {},
    methods: {
        logout() {
            Cookies.remove('role');
            Cookies.remove('token');
            this.$router.push('/login');
        },
    },
};
</script>

<style></style>
