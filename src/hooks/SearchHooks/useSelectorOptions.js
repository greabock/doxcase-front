import {ref} from 'vue';
import enumsService from '@/services/enums.service';
import sectionsService from '@/services/sections.service';

export function useSelectorOptions(filteredFields) {

    const selectorOptionsArr = ref([]);

    const createSelectOption = (field, opts, multi) => {
        return {
            selectValue: [],
            id: field.id,
            multi,
            title: field.title,
            options: opts.map((item) => ({
                key: item,
                name: item,
            })),
        };
    };
    const createEnumOption = async (field, id, multi) => {
        try {
            const enumObj = await enumsService.getEnumsObject(id);
            return {
                selectValue: [],
                id: field.id,
                multi,
                title: field.title,
                options: enumObj.values.map((item) => ({
                    name: item.title,
                    key: item.id,
                })),
            };
        } catch (e) {
            console.log(e);
        }
    };
    const createDictionaryOption = async (field, id, multi) => {
        try {
            const sectionMaterials = await sectionsService.getSectionMaterials(id);
            return {
                selectValue: [],
                id: field.id,
                multi,
                title: field.title,
                options: sectionMaterials.data.map((item) => ({
                    name: item.name,
                    key: item.id,
                })),
            };
        } catch (e) {
            console.log(e);
        }
    };

    const updateSelectorOptionsArr = async () => {
        selectorOptionsArr.value = await Promise.all(
            filteredFields.value.map(async (field) => {
                switch (field.type.name) {
                    case 'Select':
                        return createSelectOption(field, field.type.of, false);

                    case 'Enum':
                        return await createEnumOption(field, field.type.of, false);

                    case 'Dictionary':
                        return await createDictionaryOption(field, field.type.of, false);

                    case 'List':
                        switch (field.type.of.name) {
                            case 'Select':
                                return createSelectOption(field, field.type.of.of, true);

                            case 'Enum':
                                return await createEnumOption(field, field.type.of.of, true);

                            case 'Dictionary':
                                return await createDictionaryOption(field, field.type.of.of, true);
                        }
                }
            })
        );
    }

    const resetSelectorOptions = () => {
        selectorOptionsArr.value.forEach(option => {
            option.selectValue = [];
        })
    }

    return {
        selectorOptionsArr,
        updateSelectorOptionsArr,
        resetSelectorOptions
    }
}