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
    props: {
        isMaterials: {type: Boolean}
    },
    emits: ['updateExtensions', 'updateIsMaterials'],

    setup(props, {emit}) {
        const extensions = ref([]);
        watch( extensions, (newVal) => {
            emit('updateExtensions', newVal);
        });
        const isMaterialsHandler =  (e, value) => {
            emit('updateIsMaterials', value);
        };

        return {
            extensions,
            isMaterialsHandler,
        }
    }

};
</script>

<style scoped>

</style>