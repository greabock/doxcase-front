<template>
  <main
      class="main-block d-flex align-items-center">
    <div class="search-block search-block--mx">
      <div class="sSections__center-empty">
        <div class="not-found-logo">
          <img src="/img/404.svg">
        </div>
        <p>К сожалению такой страницы не существует. </p>
        <router-link to="/">На главную</router-link>
      </div>
    </div>
  </main>
</template>

<script>
export default {
    name: 'NotFoundPage',
    components: {},
};
</script>

<style scoped>
.not-found-logo {
  margin-bottom: 40px;
}
</style>
