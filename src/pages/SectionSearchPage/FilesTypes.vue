<template>
    <div class="sSearchResult__aside-group">
        <div class="fw-500 pb-3">Формат</div>
        <div class="row mb-3">
            <div
                v-for="ext in initExtensions"
                :key='ext'
                class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        :value='ext'
                        :checked='modelValue.includes(ext)'
                        @change='e => changeHandler(e.target.value)'
                        class="custom-input__input form-check-input"
                        name="checkbox"
                        type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">{{ ext }}</span>
                </label>
            </div>
        </div>
<!--        <a class="small fw-500">Показать все</a>-->
    </div>
</template>

<script>
export default {
    emits: ['update:modelValue'],
    props: {
            modelValue: {
               type: Array,
                default: () => []
            }
    },
    setup(props, {emit}) {
        const initExtensions = (['materials', 'doc', 'xls', 'xlsx', 'jpg', 'pdf', 'png', 'pptx',]);
        const changeHandler = (ext) => {

            let updExtensions;
            if (props.modelValue.includes(ext)) {
                updExtensions = props.modelValue.filter(value => value !== ext);
            } else {
                updExtensions = props.modelValue.concat(ext);
            }
            emit('update:modelValue', updExtensions);
        };

        return {
            initExtensions,
            changeHandler
        }
    }

};
</script>

<style scoped>
.sSearchResult__aside-group .custom-input {
    margin-bottom: 0;
}
</style>