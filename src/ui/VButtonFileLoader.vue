<template>
    <div v-bind="getRootProps()">
        <input v-bind="getInputProps()" />
        <slot></slot>
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
            ctx.emit('upload', acceptFiles);
            ctx.emit('reject', rejectReasons);
        }

        const {getRootProps, getInputProps, ...rest} = useDropzone({onDrop, accept: props.accept});

        return {
            files,
            getRootProps,
            getInputProps,
            ...rest,
        };
    },
};
</script>
