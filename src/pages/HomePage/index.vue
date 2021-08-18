<template>
    <main class="main-block d-flex align-items-center">
        <div class="search-block search-block--mx">
            <form>
                <div class="search-block__input-wrap form-group">
                    <input class="search-block__input form-control" name="text" type="text" placeholder="Поиск" />
                </div>
                <!-- +e.input-wrap-->
                <button class="search-block__btn" type="submit">
                    <svg class="icon icon-search">
                        <use xlink:href="/img/svg/sprite.svg#search"></use>
                    </svg>
                </button>
            </form>
        </div>
    </main>
</template>

<script>
export default {
    name: 'HomePage',
};
</script>

<style></style>
