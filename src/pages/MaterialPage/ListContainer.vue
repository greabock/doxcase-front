<template>
    <ul>
        <li v-for="(el, i) of lists" :key="i">
            <template v-if="el.value && el.value.length">
                <div class="strong">{{ el.title }}</div>
                <ul v-if="el.value">
                    <li v-for="(v, x) of el.value" :key="x">
                        <template v-if="el.type == 'List'">
                            <template v-if="el.ofType == 'Enum'">
                                {{ v.title }}
                            </template>
                            <template v-else-if="el.ofType == 'Dictionary'">
                                <a :href="v.link">
                                    {{ v.title }}
                                </a>
                            </template>
                            <template v-else>
                                {{ v }}
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="el.type == 'Enum'">
                                {{ v.title }}
                            </template>
                            <template v-else-if="el.type == 'Dictionary'">
                                <a :href="v.link">
                                    {{ v.title }}
                                </a>
                            </template>
                            <template v-else>
                                {{ v }}
                            </template>
                        </template>
                    </li>
                </ul>
            </template>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        lists: Array,
    },
};
</script>
