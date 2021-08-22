import enumsService from '@/services/enums.service';

export default async function useFields(fields, materials) {
    const fieldCreate = ({type, ofType, props, value = null, field}) => {
        return {
            ...field,
            type,
            ofType,
            props,
            value,
        };
    };

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
        String: ({field, value}) =>
            fieldCreate({
                field,
                type: 'String',
                value,
                props: {
                    placeholder: field.description,
                },
            }),
        Wiki: ({field, value}) =>
            fieldCreate({
                field,
                type: 'Wiki',
                value,
                props: {
                    placeholder: field.description,
                },
            }),
        Text: ({field, value}) =>
            fieldCreate({
                field,
                type: 'Text',
                value,
                props: {
                    placeholder: field.description,
                },
            }),
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
