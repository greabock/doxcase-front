<template>
    <div class="customs-select">
        <div class="row">
            <div
                v-for="item of selectorOptionsArr"
                :key="item?.id"
                class="col-auto">
                <div class="customs-select__input-wrap form-group">
                    <label>
                        <span class="customs-select__input-title">{{item?.title}}</span>
                        <select
                            @change="(event) => $emit('updateFilter', { name: item.id, value: event.target.value})"
                            class="customs-select__input form-select custom-select"
                        >
                            <option value="Выберите" disabled selected>Выберите</option>
                            <option
                                v-for="option in item?.options"
                                :value="option?.value"
                                :key="option?.name"
                            >{{option?.title}}
                            </option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {ref, onMounted, watch} from 'vue';
import enumsService from '@/services/enums.service';
import sectionsService from '@/services/sections.service';

export default {
    props: {
        fieldsArray: Array,
        default: []
    },
    emits: ['updateFilter'],

    setup(props) {

        const selectorOptionsArr = ref([]);
        watch(selectorOptionsArr, (newVal) => {
            console.log(newVal);
        })

        const createSelectOption = (field) => {
            selectorOptionsArr.value.push({
                id: field.id,
                title: field.title,
                options: (field.type.of).map(item => (
                    {
                      title: item,
                      value: item
                    }))
            });
        };
        const createEnumOption = async (field, id) => {
            try {
                const enumObj = await enumsService.getEnumsObject(id);
                selectorOptionsArr.value.push({
                    id,
                    title: field.title,
                    options: (enumObj.values).map(item => (
                        {
                          title: item.title,
                          value: item.id
                        }))
                });
            } catch (e) {
                console.log(e);
            }
        };
        const createDictionaryOption = async (field, id) => {
            try {
                const sectionMaterials = await sectionsService.getSectionMaterials(id);
                selectorOptionsArr.value.push({
                    id,
                    title: field.title,
                    options: (sectionMaterials.data).map(item => (
                        {
                           title: item.name,
                           value: item.id
                        }))
                });
            } catch (e) {
                console.log(e);
            }
        };

        onMounted( async () => {
            if (props.fieldsArray?.length) {
                props.fieldsArray.map( async (field) => {

                    switch (field.type.name) {
                        case 'Select':
                            createSelectOption(field);
                            break;

                        case 'Enum':
                            await createEnumOption(field, field.type.of);
                            break;

                        case 'Dictionary':
                            await createDictionaryOption(field, field.type.of);
                            break;

                       case 'List':
                           switch (field.type.of.name) {

                               case 'Enum':
                                   await createEnumOption(field, field.type.of.of);
                                   break;

                               case 'Dictionary':
                                   await createDictionaryOption(field, field.type.of.of);
                                   break;
                       }
                    }
                });
            }
        });

        return {
            selectorOptionsArr,
        }
    }
};
</script>

<style scoped>

</style>