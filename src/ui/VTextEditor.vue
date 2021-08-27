<template>
    <div class="text-editor__container">
        <quill-editor
            class="text-editor"
            v-model:value="state.content"
            :options="state.editorOption"
            @change="onEditorChange($event)"
        />
        <div class="input-message invalid-feedback" v-if="error">{{ error }}</div>
    </div>
</template>

<script>
import {quillEditor} from 'vue3-quill';
import {reactive} from '@vue/reactivity';

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
                        // [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }, { header: 5 }, { header: 6 }],
                        [{list: 'ordered'}, {list: 'bullet'}],
                        [{script: 'sub'}, {script: 'super'}],
                        [{indent: '-1'}, {indent: '+1'}],
                        [{direction: 'rtl'}],
                        // [{ size: ['small', false, 'large', 'huge'] }],
                        [{header: [1, 2, 3, 4, 5, 6, false]}],
                        // [{ color: [] }, { background: [] }],
                        // [{ font: [] }],
                        [{align: []}],
                        ['clean'],
                        ['link', 'image'],
                    ],
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
</style>

<style scoped>
.text-editor__container .error-text-editor >>> .ql-container.ql-snow,
.text-editor__container .error-text-editor >>> .ql-toolbar.ql-snow {
    border-color: #eb5757;
}
</style>