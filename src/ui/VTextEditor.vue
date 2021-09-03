<template>
    <div :class="['text-editor__container', {'error-text-editor': error}]">
        <quill-editor
            class="text-editor"
            v-model:value="state.content"
            :options="state.editorOption"
            @change="onEditorChange($event)"
            @blur="$emit('blur', modelValue)"
        />
        <div class="input-message invalid-feedback" v-if="error">{{ error }}</div>
    </div>
</template>

<script>
import {quillEditor, Quill} from 'vue3-quill';
import {reactive} from '@vue/reactivity';

import ImageUploader from 'quill-image-uploader';

Quill.register('modules/imageUploader', ImageUploader);

export default {
    components: {
        quillEditor,
    },
    props: {
        modelValue: String,
        placeholder: String,
        width: String,
        height: String,
        error: String,
        upload: {
            type: Function,
            default: (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onloadend = function () {
                        const base64data = reader.result;
                        resolve(base64data);
                    };
                });
            },
        },
    },
    setup(props, {emit}) {
        const state = reactive({
            content: props.modelValue || '',
            editorOption: {
                placeholder: props.placeholder,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{list: 'ordered'}, {list: 'bullet'}],
                        [{script: 'sub'}, {script: 'super'}],
                        [{indent: '-1'}, {indent: '+1'}],
                        [{direction: 'rtl'}],
                        [{header: [1, 2, 3, 4, 5, 6, false]}],
                        [{align: []}],
                        ['clean'],
                        ['link', 'image'],
                    ],
                    imageUploader: {
                        upload: props.upload,
                    },
                },
            },
        });

        const onEditorChange = ({html}) => {
            emit('update:modelValue', html);
            emit('change', html);
        };

        return {state, onEditorChange};
    },
};
</script>

<style scoped>
.text-editor__container {
    background: #fff;
    position: relative;
    margin-bottom: 1rem;
}

.text-editor >>> .ql-editor {
    min-height: 152px;
}

.input-message {
    display: block;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    padding: 5px 1rem;
}

.text-editor__container.error-text-editor >>> .ql-container.ql-snow,
.text-editor__container.error-text-editor >>> .ql-toolbar.ql-snow {
    border-color: #eb5757;
}
</style>
