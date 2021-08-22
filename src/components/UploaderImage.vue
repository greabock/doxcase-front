<template>
    <div>
        <div class="row align-items-center">
            <VButtonFileLoader @upload="uploadFile" class="col-auto mb-3">
                <button class="form-wrap__btn-choose">Выбрать...</button>
            </VButtonFileLoader>
            <div v-if="modelValue || preview" class="col-auto mb-3">
                <div
                    class="form-wrap__icon-add-wrap"
                    :style="{
                        'background-image': `url(${src || preview})`,
                    }"
                ></div>
            </div>
            <div v-if="modelValue" class="col-auto mb-3">
                <a class="text-danger" @click="deleteFile">Удалить</a>
            </div>
        </div>
    </div>
</template>

<script>
import VButtonFileLoader from '@/ui/VButtonFileLoader';
import {computed} from '@vue/runtime-core';

export default {
    components: {
        VButtonFileLoader,
    },
    props: {
        modelValue: File,
        preview: String,
    },
    setup(props, {emit}) {
        const uploadFile = ([f]) => {
            emit('update:modelValue', f);
        };

        const deleteFile = () => {
            emit('update:modelValue', null);
        };

        const src = computed(() => {
            if (props.modelValue) {
                return window.URL.createObjectURL(props.modelValue);
            }

            return null;
        });

        return {
            deleteFile,
            uploadFile,
            src,
        };
    },
};
</script>

<style lang="scss" scoped>
.form-wrap__icon-add-wrap {
    background: #e3eafe;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background-position: center;
}

.text-danger {
    cursor: pointer;
}
</style>
