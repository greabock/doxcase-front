import enumsService from '@/services/enums.service';
import {useField} from 'vee-validate';
import * as yup from 'yup';
yup.setLocale({
    mixed: {
        default: 'Поле не валидно.',
        required: 'Поле обязательно для заполнения.',
    },
});

function validateString({required, min, max}) {
    console.log(required, min, max);
    let f = yup.string().nullable();
    if (required) {
        f = f.required();
    }

    if (min) {
        f = f.min(min);
    }

    if (max) {
        f = f.max(max);
    }

    return f;
}

function createFieldValidation(field, value) {
    const {
        value: model,
        errorMessage: error,
        handleChange,
    } = useField(
        field.id,
        validateString({
            required: field.required,
            min: field.type.min,
            max: field.type.max,
        })
    );
    model.value = value;

    return {model, error, handleChange};
}

const fieldCreate = ({type, ofType, props, value = '', field}) => {
    return {
        ...field,
        type,
        ofType,
        props,
        value,
    };
};

export default async function useFields(fields, materials) {
    const fieldsDictionary = {
        Boolean: ({field, value = false}) => fieldCreate({type: 'Boolean', value: !!value, field}),
        Date: ({value, field}) => {
            return fieldCreate({
                field,
                type: 'Date',
                value,
                props: {
                    placeholder: field.description,
                },
            });
        },
        Enum: async ({field, multiple, value, ofType}) => {
            const of = ofType ? field.type.of.of : field.type.of;

            const enums = await enumsService.getEnumsObject(of);
            const options = enums.values.map((x) => ({
                key: x.id,
                name: x.title,
            }));

            return fieldCreate({
                field,
                ofType,
                type: 'Enum',
                value,
                props: {
                    options,
                    placeholder: field.description,
                    multiple,
                },
            });
        },
        Select: ({field, value, multiple, ofType}) => {
            const of = ofType ? field.type.of.of : field.type.of;
            const options = of.map((x) => ({
                key: x,
                name: x,
            }));

            return fieldCreate({
                field,
                type: 'Select',
                ofType,
                value:
                    value && ofType
                        ? value.map((x) => ({
                              name: x,
                              key: x,
                          }))
                        : {
                              key: value,
                              name: value,
                          },
                props: {
                    options,
                    placeholder: field.description,
                    multiple,
                },
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
            });
        },
        Wiki: ({field, value}) => {
            const {model, error, handleChange} = createFieldValidation(field, value);

            return fieldCreate({
                field,
                type: 'Wiki',
                value: model,
                props: {
                    placeholder: field.description,
                    error,
                    onBlur: handleChange,
                },
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
            });
        },
        List: ({value = [], field}) => {
            const ofType = field.type.of.name;
            return fieldsDictionary[ofType]({field, multiple: true, value, ofType});
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
