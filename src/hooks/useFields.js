import enumsService from '@/services/enums.service';
import sectionsService from '@/services/sections.service';
import fileService from '@/services/files.service';

import {useField} from 'vee-validate';
import * as yup from 'yup';
yup.setLocale({
    mixed: {
        default: 'Поле не валидно.',
        required: 'Поле обязательно для заполнения.',
    },
});

function validateString({required, max}) {
    let f = yup.string().nullable();
    if (required) {
        f = f.required();
    }

    if (max) {
        f = f.max(max);
    }

    return f;
}

function createFieldValidation(field, value = '') {
    const {
        value: model,
        errorMessage: error,
        handleChange,
    } = useField(
        field.id,
        validateString({
            required: field.required,
            min: field.type?.min,
            max: field.type?.max,
        }),
        {
            validateOnValueUpdate: false,
        }
    );

    model.value = value;

    return {model, error, handleChange};
}

const isRequiredList = (required) => (value) => {
    if (required) {
        if (value && Object.keys(value).length) {
            return true;
        }

        return 'Выберете элемент из списка.';
    }

    return true;
};

function createFieldListValidation(field, value) {
    const {
        value: model,
        errorMessage: error,
        handleChange,
    } = useField(field.id, isRequiredList(field.required), {
        validateOnValueUpdate: false,
    });

    model.value = value;

    return {model, error, handleChange};
}

const fieldCreate = ({type, ofType, props, value = '', field, validate}) => {
    return {
        ...field,
        type,
        ofType,
        props,
        value,
        validate,
    };
};

export default async function useFields(fields, materials) {
    const fieldsDictionary = {
        Boolean: ({field, value = false}) => fieldCreate({type: 'Boolean', value: !!value, field}),
        Date: ({value, field}) => {
            const {model, error, handleChange} = createFieldValidation(field, value && new Date(value));

            return fieldCreate({
                field,
                type: 'Date',
                value: model,
                props: {
                    placeholder: field.description,
                    error,
                    onBlur: handleChange,
                },
                validate: () => handleChange(model.value),
            });
        },
        String: ({field, value}) => {
            const {model, error, handleChange} = createFieldValidation(field, value);

            return fieldCreate({
                field,
                type: 'String',
                value: model,
                props: {
                    placeholder: field.description,
                    error,
                    onBlur: handleChange,
                },
                validate: () => handleChange(model.value),
            });
        },
        Wiki: ({field, value}) => {
            const {model, error, handleChange} = createFieldValidation(field, value);
            const upload = async (file) =>  {
                const bodyFormData = new FormData();
                bodyFormData.append('files[]', file);
                const data = await fileService.uploadFiles(bodyFormData);
                const [img] = data
                return img.url
            }

            return fieldCreate({
                field,
                type: 'Wiki',
                value: model,
                props: {
                    upload,
                    placeholder: field.description,
                    error,
                    onBlur: handleChange,
                },
                validate: () => handleChange(model.value),
            });
        },
        Text: ({field, value}) => {
            const {model, error, handleChange} = createFieldValidation(field, value);

            return fieldCreate({
                field,
                type: 'Text',
                value: model,
                props: {
                    placeholder: field.description,
                    error,
                    onBlur: handleChange,
                },
                validate: () => handleChange(model.value),
            });
        },
        Enum: async ({type = 'Enum', field, multiple, value, ofType}) => {
            const of = ofType ? field.type.of.of : field.type.of;
            const values =
                value &&
                (ofType
                    ? value.map((x) => ({
                          name: x.title,
                          key: x.id,
                      }))
                    : {
                          key: value.id,
                          name: value.title,
                      });

            const enums = await enumsService.getEnumsObject(of);
            const options = enums.values.map((x) => ({
                key: x.id,
                name: x.title,
            }));

            const {model, error, handleChange} = createFieldListValidation(field, values);

            return fieldCreate({
                field,
                ofType,
                type,
                value: values,
                props: {
                    options,
                    placeholder: field.description,
                    multiple,
                    error,
                    onSelect: handleChange,
                    onBlur: () => handleChange(model.value),
                },
                validate: () => handleChange(model.value),
            });
        },
        Dictionary: async ({type = 'Dictionary', field, value, multiple, ofType}) => {
            const of = ofType ? field.type.of.of : field.type.of;
            const values =
                value &&
                (ofType
                    ? value.map((x) => ({
                          name: x.name,
                          key: x.id,
                      }))
                    : {
                          key: value.id,
                          name: value.name,
                      });
            const materials = await sectionsService.getSectionMaterials(of);

            const options = materials.data.map((x) => ({
                key: x.id,
                name: x.name,
            }));

            const {model, error, handleChange} = createFieldListValidation(field, values);

            return fieldCreate({
                field,
                type,
                ofType,
                value: values,
                props: {
                    options,
                    placeholder: field.description,
                    multiple,
                    error,
                    onSelect: handleChange,
                    onBlur: () => handleChange(model.value),
                },
                validate: () => handleChange(model.value),
            });
        },
        Select: ({type = 'Select', field, value, multiple, ofType}) => {
            const of = ofType ? field.type.of.of : field.type.of;
            const options = of.map((x) => ({
                key: x,
                name: x,
            }));

            const values =
                value &&
                (ofType
                    ? value.map((x) => ({
                          name: x,
                          key: x,
                      }))
                    : {
                          key: value,
                          name: value,
                      });

            const {model, error, handleChange} = createFieldListValidation(field, values);

            return fieldCreate({
                field,
                type,
                ofType,
                value: model,
                props: {
                    options,
                    placeholder: field.description,
                    multiple,
                    error,
                    onSelect: handleChange,
                    onBlur: () => handleChange(model.value),
                },
                validate: () => handleChange(model.value),
            });
        },
        List: ({value = [], field}) => {
            const ofType = field.type.of.name;
            return fieldsDictionary[ofType]({type: 'List', field, multiple: true, value, ofType});
        },
    };

    const f = [];
    for (const field of fields) {
        if (materials) {
            const data = await fieldsDictionary[field.type.name]({field, value: materials[field.id]});
            f.push(data);
        } else {
            const data = await fieldsDictionary[field.type.name]({field});
            f.push(data);
        }
    }

    return f;
}
