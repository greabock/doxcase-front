<template>
    <h1>Profile Page</h1>
    <button @click="handleLogout">Logout</button>
</template>

<script>
import {useAuth} from '@/hooks/useAuth';
export default {
    name: 'ProfilePage',
    setup() {
        const {handleLogout} = useAuth();
        return {
            handleLogout,
        };
    },
};
</script>

<style scoped></style>
