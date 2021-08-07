<template>
    <div class="menu-assistant">
        <router-link to="/">Index</router-link>
        <router-link to="/auth">Login</router-link>
        <router-link to="/profile">Profile</router-link>
        <router-link to="/search">Search</router-link>
        <router-link to="/material-creation">Material creation</router-link>
        <router-link to="/sections">Sections</router-link>
        <router-link to="/section-creation">Section creation</router-link>
        <router-link to="/section/section-id">Section Id</router-link>
        <router-link to="/material/someId">Material id=someId</router-link>
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
}
.menu-assistant A {
    color: #aaa;
    display: block;
    margin-right: 20px;
}
</style>
