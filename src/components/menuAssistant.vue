<template>
    <div class="menu-assistant">
        <router-link to="/">Index</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/profile">Profile</router-link>
        <router-link to="/search">Search</router-link>
        <router-link to="/edit">Edit (admin)</router-link>
        <router-link to="/material-creation">Material creation</router-link>
        <router-link to="/chapter-list">Chapter list</router-link>
        <router-link to="/chapter-creation">Chapter creation</router-link>
        <router-link to="/material/someId">Material id=someId</router-link>
        <router-link to="/"></router-link>
    </div>
</template>

<script>
export default {};
</script>
<style scoped>
.menu-assistant {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    padding: 5px 10px;
    background-color: #333;
    margin-top: 40px;
}
.menu-assistant A {
    color: #aaa;
    display: block;
    margin-right: 20px;
}
</style>
