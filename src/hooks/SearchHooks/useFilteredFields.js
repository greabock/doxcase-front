import {computed} from 'vue';

export function useFilteredFields(props) {

    const filteredFields = computed(() => {
        let fieldsToSelectors;
        if (props.fieldsArray.length) {
            fieldsToSelectors = props.fieldsArray
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