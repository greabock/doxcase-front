<template>
    <div class="sSearchResult__aside-group">
        <div class="fw-500 pb-3">Формат</div>
        <div class="row mb-3">
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='extensions'
                        value='doc'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">doc</span>
                </label>
            </div>
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='extensions'
                        value='xls'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">xls</span>
                </label>
            </div>
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='extensions'
                        value='xlsx'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">xlsx</span>
                </label>
            </div>
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='extensions'
                        value='jpg'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">jpg</span>
                </label>
            </div>
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='extensions'
                        value='pdf'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">pdf</span>
                </label>
            </div>
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='isMaterials'
                        value='materials'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">страницы</span>
                </label>
            </div>
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='extensions'
                        value='fig'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">fig</span>
                </label>
            </div>
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='extensions'
                        value='pptx'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">pptx</span>
                </label>
            </div>


        </div>
        <a class="small fw-500">Показать все</a>
    </div>
</template>

<script>
import {ref, watch} from 'vue';
export default {
    emits: ['updateExtensions', 'updateIsMaterials'],

    setup(props, {emit}) {
        const extensions = ref([]);
        const isMaterials = ref(false);
        watch( extensions, (newVal) => {
            emit('updateExtensions', newVal);
        });
        watch( isMaterials, (newVal) => {
            emit('updateIsMaterials', newVal);
        });

        return {
            extensions,
            isMaterials,
        }
    }

};
</script>

<style scoped>

</style>