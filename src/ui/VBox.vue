<template>
    <button
        class="box"
        :class="{active}"
        :key="item?.id"
    >
        {{ title }}
        <BtnClose @click.stop="$emit('delete')"  class="delete" />
    </button>
</template>

<script>
import BtnClose from './icons/close.svg.vue';

export default {
    components: {
        BtnClose,
    },
    props: {
        active: Boolean,
        title: String,
    },
    setup() {
        
    },
}
</script>

<style scoped>
.box {
    border-radius: 0.3rem;
    font-weight: 400;
    font-size: 14px;
    padding: 0.25em 0.625rem;
    border: none;
    background-color: #e3eafe;
    color: #1d47ce;
    transition: 0.3s;
    display: inline-flex;
    align-items: center;
}

.active.box,
.box:hover {
    background-color: #1d47ce;
    color: #fff;
}

.delete {
    stroke: #1d47ce;
    cursor: pointer;
    width: 12px;
    margin-left: 10px;
    transition: 0.3s;
}

.active .delete,
.box:hover .delete {
    stroke: #fff;
}
</style>