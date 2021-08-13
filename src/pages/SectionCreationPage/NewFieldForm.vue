<template>
    <div v-if="isFieldModalVisible" class="mock-modal__wrapper">
        <div class="mock-modal__cont">
            <b class="mock-modal__closer" @click="setFieldModalVisible(false)">x</b>
            <div class="modal-win" id="modal-add-field">
                <div class="form-wrap">
                    <form>
                        <div class="h3 mb-4">Новое поле</div>
                        <div class="form-wrap__input-wrap form-group">
                            <label
                                ><span class="form-wrap__input-title">Выберите тип поля</span>
                                <select
                                        v-model="fieldType"
                                        class="form-wrap__input form-select"
                                >
                                    <option value="Text">Текстовое поле</option>
                                    <option value="String">Короткое текстовое поле</option>
                                    <option value="Wiki">Wiki редактор</option>
                                    <option value="Select">Значения из выпадающего списка</option>
                                    <option value="Boolean">Чекбокс</option>
                                    <option value="Date">Выбор даты</option>
                                    <option value="File">Загрузка документа</option>
                                    <option value="Enum">Значения из справочников</option>
                                    <option value="Dictionary">Значения из разделов</option>
                                </select>
                            </label>
                        </div>
                        <!-- +e.input-wrap-->
                        <div class="typed-field-forms">
                            <text-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'Text'"></text-field>
                            <string-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'String'"></string-field>
                            <wiki-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'Wiki'"></wiki-field>
                            <selector-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'Select'"></selector-field>
                            <checkbox-field  :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'Boolean'"></checkbox-field>
                            <date-field  :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'Date'"></date-field>
                            <document-upload-field  :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'File'"></document-upload-field>
                            <enum-field  :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'Enum'"></enum-field>
                            <dictionary-field :fieldToChange="fieldToChange" :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'Dictionary'"></dictionary-field>
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
    },
    props: {
        fieldToChange: {
            type: Object,
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

        const defineInitType = (field) => {
            if (!field.type) return 'Text';
            if (field.type?.name === 'List') return field.type?.of?.name; // Название типа у списка.
            return field.type?.name;
        }

        const fieldType = ref('Text');
        watch(() => props.fieldToChange, () => {
            fieldType.value = defineInitType(props.fieldToChange)
        });

        const setFieldModalVisible = (bool) => {
            emit('updateFieldModalVisible', bool);
        };
        const addNewField = (newField) => {
            emit('addNewField', newField);
        };
        return {
            setFieldModalVisible,
            fieldType,
            addNewField,
        };
    },
};
</script>

<style scoped>
INPUT::placeholder {
    color: #d6d6d6;
}
.mock-modal__wrapper {
    display: flex;
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
}
.mock-modal__cont {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 550px;
    background-color: #fff;
    padding: 32px;
    border-radius: 5px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
}
.mock-modal__closer {
    display: block;
    position: absolute;
    font-size: 26px;
    line-height: 26px;
    top: 15px;
    right: 20px;
    cursor: pointer;
}

.mock-modal__buttons button:first-child {
    margin-right: 5px;
}
</style>
