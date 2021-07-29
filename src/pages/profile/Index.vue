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
    <button @click="handleLogout">Logout</button>
</template>

<script>
import {useAuth} from '@/hooks/useAuth';

export default {
    name: 'Profile',
    components: {},
    setup() {
        const {handleLogout} = useAuth();
        return {
            handleLogout,
        };
    },
};
</script>

<style></style>
