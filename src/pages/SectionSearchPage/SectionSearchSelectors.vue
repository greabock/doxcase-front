<template>
    <div class="customs-select">
        <div class="row">
            <div
                v-for="item of fieldsArray"
                :key="item?.id"
                class="col-auto">
                <div class="customs-select__input-wrap form-group">
                    <label>
                        <span class="customs-select__input-title">{{item?.title}}</span>
                        <select
                            @change="(event) => $emit('updateSelector', { name: item.id, value: event.target.value})"
                            class="customs-select__input form-select custom-select"
                        >
                            <option value="Выберите" disabled selected>Выберите</option>
                            <option
                                v-for="option in item?.options"
                                :value="option?.value"
                                :key="option?.name"
                            >{{option?.title}}
                            </option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props: {
        fieldsArray: Array,
        default: []
    },
    emits: ['updateSelector'],
};
</script>

<style scoped>

</style>