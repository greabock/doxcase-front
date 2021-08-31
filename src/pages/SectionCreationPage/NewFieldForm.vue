<template>
    <div
        @click="closeModal"
        ref="root"
        v-if="isFieldModalVisible" class="mock-modal__wrapper"
    >

        <div
            class="mock-modal__cont fancybox__content">
            <button class="carousel__button is-close" title="Close" @click="setFieldModalVisible(false)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg>
            </button>
            <div class="" id="modal-add-field">
                <div class="form-wrap">
                    <form>
                        <div class="h3 mb-4">Новое поле</div>

                        <v-select
                            class="mb-3"
                            v-model="fieldType"
                            :options="options"
                            bordered
                        />
                        <!-- +e.input-wrap-->
                        <div class="typed-field-forms">
                            <text-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'Text'"></text-field>
                            <string-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'String'"></string-field>
                            <wiki-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'Wiki'"></wiki-field>
                            <selector-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'Select'"></selector-field>
                            <checkbox-field  :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'Boolean'"></checkbox-field>
                            <date-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'Date'"></date-field>
                            <document-upload-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'File'"></document-upload-field>
                            <enum-field :allEnums="allEnums"  :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'Enum'"></enum-field>
                            <dictionary-field :allSections="allSections" :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType.key === 'Dictionary'"></dictionary-field>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, watch} from 'vue';
import TextField from '@/pages/SectionCreationPage/FieldTypes/TextField';
import StringField from '@/pages/SectionCreationPage/FieldTypes/StringField';
import CheckboxField from '@/pages/SectionCreationPage/FieldTypes/CheckboxField';
import DateField from '@/pages/SectionCreationPage/FieldTypes/DateField';
import EnumField from '@/pages/SectionCreationPage/FieldTypes/EnumField';
import DocumentUploadField from '@/pages/SectionCreationPage/FieldTypes/DocumentUploadField';
import SelectorField from '@/pages/SectionCreationPage/FieldTypes/SelectorField';
import DictionaryField from '@/pages/SectionCreationPage/FieldTypes/DictionaryField';
import WikiField from '@/pages/SectionCreationPage/FieldTypes/WikiField';
import VSelect from '@/ui/VSelect';

export default {
    components: {
        StringField,
        TextField,
        CheckboxField,
        DateField,
        EnumField,
        DocumentUploadField,
        SelectorField,
        DictionaryField,
        WikiField,
        VSelect,
    },
    props: {
        allEnums: {
            type: Array
        },
        allSections: {
          type: Array
        },
        fieldToChange: {
            type: Object,
            default: () => {}
        },
        fieldsArrLength: {
            type: Number
        },
        isFieldModalVisible: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['updateFieldModalVisible', 'addNewField'],
    setup(props, {emit}) {

        const options = [
            {key: "Text", name: "Текстовое поле"},
            {key: "String", name: "Короткое текстовое поле"},
            {key: "Wiki", name: "Wiki редактор"},
            {key: "Select", name: "Значения из выпадающего списка"},
            {key: "Boolean", name: "Чекбокс"},
            {key: "Date", name: "Выбор даты"},
            {key: "File", name: "Загрузка документа"},
            {key: "Enum", name: "Значения из справочников"},
            {key: "Dictionary", name: "Значения из разделов"},
        ]
        const root = ref(null);
        const defineInitType = (field) => {
            if (!field.type) {
                return {key: "Text", name: "Текстовое поле"};
            }
            if (field.type?.name === 'List') {
                return options.find( item => item.key === field.type.of.name);
            }
            return options.find( item => item.key === field.type.name);
        }

        const fieldType = ref("Text");
        watch(() => props.fieldToChange, () => {
            fieldType.value = defineInitType(props.fieldToChange);
        });
        const setFieldModalVisible = (bool) => {
            emit('updateFieldModalVisible', bool);
        };
        const addNewField = (newField) => {
            emit('addNewField', newField);
        };
        const closeModal = (e) => {
            if (props.isFieldModalVisible && e.target === root.value) {
                setFieldModalVisible(false);
            }
        };
        return {
            setFieldModalVisible,
            fieldType,
            addNewField,
            options,
            root,
            closeModal,
        };
    },
};
</script>

<style scoped>
INPUT::placeholder {
    color: #d6d6d6;
}
.mock-modal__wrapper {
    --carousel-button-svg-stroke-width: 2;
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 1rem;

    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
.mock-modal__cont {
    display: flex;
    position: relative;
    flex-direction: column;
    max-width: 550px;
    background-color: #fff;
    padding: 32px;
    border-radius: 5px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);

    margin: 1rem auto;
}
.mock-modal__buttons button:first-child {
    margin-right: 5px;
}
</style>
