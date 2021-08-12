<template>
    <div v-if="isFieldModalVisible" class="mock-modal__wrapper">
        <div class="mock-modal__cont fancybox__content">
            <!-- <b class="mock-modal__closer" @click="setFieldModalVisible(false)">x</b> -->
            <button class="carousel__button is-close" title="Close" @click="setFieldModalVisible(false)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg>
            </button>
            <div class="" id="modal-add-field">
                <div class="form-wrap">
                    <form>
                        <div class="h3 mb-4">Новое поле</div>
                        <div class="form-wrap__input-wrap form-group">
                            <label
                                ><span class="form-wrap__input-title">Выберите тип поля</span>
                                <select class="form-wrap__input form-select" v-model="fieldType" name="select">
                                    <option value="text-field">Текстовое поле</option>
                                    <option value="string-field">Короткое текстовое поле</option>
                                    <option value="selector-field">Значения из выпадающего списка</option>
                                    <option value="checkbox-field">Чекбокс</option>
                                    <option value="date-field">Выбор даты</option>
                                    <option value="document-upload-field">Загрузка документа</option>
                                    <option value="dictionary-value-field">Значения из базы знаний</option>
                                </select>
                            </label>
                        </div>
                        <!-- +e.input-wrap-->
                        <div class="typed-field-forms">
                            <text-field :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'text-field'"></text-field>
                            <string-field :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'string-field'"></string-field>
                            <selector-field :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'selector-field'"></selector-field>
                            <checkbox-field :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'checkbox-field'"></checkbox-field>
                            <date-field :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'date-field'"></date-field>
                            <document-upload-field :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'document-upload-field'"></document-upload-field>
                            <dictionary-field :fieldsArrLength="fieldsArrLength" @addNewField="addNewField" v-if="fieldType === 'dictionary-value-field'"></dictionary-field>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
import TextField from '@/pages/SectionCreationPage/FieldTypes/TextField';
import StringField from '@/pages/SectionCreationPage/FieldTypes/StringField';
import CheckboxField from '@/pages/SectionCreationPage/FieldTypes/CheckboxField';
import DateField from '@/pages/SectionCreationPage/FieldTypes/DateField';
import DictionaryField from '@/pages/SectionCreationPage/FieldTypes/DictionaryField';
import DocumentUploadField from '@/pages/SectionCreationPage/FieldTypes/DocumentUploadField';
import SelectorField from '@/pages/SectionCreationPage/FieldTypes/SelectorField';

export default {
    components: {
        StringField,
        TextField,
        CheckboxField,
        DateField,
        DictionaryField,
        DocumentUploadField,
        SelectorField,
    },
    props: {
        fieldsArrLength: {
            type: Number
        },
        isFieldModalVisible: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, {emit}) {
        const setFieldModalVisible = (bool) => {
            emit('updateFieldModalVisible', bool);
        };
        const addNewField = (newField) => {
            emit('addNewField', newField);
        };
        const fieldType = ref('text-field');
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
