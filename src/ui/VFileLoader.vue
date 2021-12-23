<template>
    <div class="file-loader__container">
        <div
            v-for="(file, i) of files"
            :key="i"
            :class="['file-loader__el', multiple ? 'file-loader_multiple' : 'file-loader_single']"
        >
            {{ file.name }}
        </div>
        <div
            v-if="!files.length || multiple"
            :class="['file-loader', multiple ? 'file-loader_multiple' : 'file-loader_single']"
            v-bind="getRootProps()"
        >
            <input v-bind="getInputProps()" :accept="accept" />
            <p v-if="isDragActive">Перетащите файлы сюда ...</p>
            <p v-else>Перетащите сюда несколько файлов или щелкните, чтобы выбрать файлы.</p>
        </div>
    </div>
</template>

<script>
import {useDropzone} from 'vue3-dropzone';
import {ref} from '@vue/reactivity';

export default {
    props: {
        multiple: Boolean,
        accept: Array,
    },
    setup(props, ctx) {
        const files = ref([]);

        function onDrop(acceptFiles, rejectReasons) {
            if (props.multiple) {
                files.value.push(...acceptFiles);
            } else {
                files.value = acceptFiles;
            }

            ctx.emit('update:modelValue', files);

            ctx.emit('upload', acceptFiles);
            ctx.emit('reject', rejectReasons);
        }

        const {getRootProps, getInputProps, ...rest} = useDropzone({onDrop});

        return {
            files,
            getRootProps,
            getInputProps,
            ...rest,
        };
    },
};
</script>

<style lang="scss" scoped>
@import './scss/variable';

.file-loader__container {
    cursor: pointer;
    width: 100%;
    height: 10rem;
    display: flex;
    border: 1px solid var(--bs-primary);
    color: var(--bs-dark);
    padding: 1rem;

    &:hover {
        border-style: solid;
    }
}

.file-loader {
    display: flex;
    align-items: center;
    justify-content: center;

    &_single {
        width: 100%;
        height: 100%;
    }

    &_multiple {
        width: 8rem;
        height: 8rem;
        border: 1px dashed var(--bs-primary);
    }
}

.file-loader__el {
    margin-right: 1rem;
    overflow: hidden;
}
</style>
