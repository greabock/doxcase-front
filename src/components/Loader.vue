<template>
    <div class="content-loader__wrapper">
        <div class="content-loader__cont">Loading...</div>
    </div>
</template>

<script>
export default {

};
</script>

<style scoped>
.content-loader__wrapper {
    position: fixed;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5);
}
.content-loader__cont {
    font-size: 26px;
    color: #1d47ce;
}
</style>