import {computed} from 'vue';

export function useFilteredFields(fieldsArray) {

    const filteredFields = computed(() => {
        let fieldsToSelectors;
        if (fieldsArray.value && fieldsArray.value.length) {
            fieldsToSelectors = fieldsArray.value
                .filter(
                    (field) =>
                        field.type.name === 'Enum' ||
                        field.type.name === 'Dictionary' ||
                        field.type.name === 'Select' ||
                        field.type.name === 'List'
                );
        } else {
            fieldsToSelectors = [];
        }
        return fieldsToSelectors;
    });
    return {
        filteredFields
    }
}