<template>
    <div class="sSearchResult__aside-group">
        <div class="fw-500 pb-3">Формат</div>
        <div class="row mb-3">
            <div class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='isMaterials'
                        value='materials'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">страницы</span>
                </label>
            </div>

            <div
                v-for="ext in extensions"
                :key='ext.name'
                class="col-lg-4 col-md-6 mb-2">
                <label class="custom-input form-check">
                    <input
                        v-model='ext.value'
                        class="custom-input__input form-check-input" name="checkbox" type="checkbox"
                    />
                    <span class="custom-input__text form-check-label">{{ ext.name }}</span>
                </label>
            </div>
        </div>
<!--        <a class="small fw-500">Показать все</a>-->
    </div>
</template>

<script>
import {ref, watch} from 'vue';

export default {
    emits: ['updateExtensions', 'updateIsMaterials'],
    props: {
            activeExtensions: {
               type: Array
            }
    },
    setup(props, {emit}) {
        const initExtensions = ([
            {name:'doc', value: false},
            {name:'xls', value: false},
            {name:'xlsx', value: false},
            {name:'jpg', value: false},
            {name:'pdf', value: false},
            {name:'fig', value: false},
            {name:'pptx', value: false}

        ]);
        const extensions = ref(initExtensions);

        const isMaterials = ref(false);

        watch( props.activeExtensions, (newVal) => {
            extensions.value = initExtensions.map(item => {
                const isActive =  newVal.filter(val => val === item.name);
                if (isActive) {
                    return {...item, value: true};
                } else {
                    return item
                }
            })
        });

        watch( extensions, (newVal) => {
            const newExtensions = newVal.filter(item => item.value).map(item => item.name);
            emit('updateExtensions', newExtensions);
        },
            {deep: true});

        watch( isMaterials, (newVal) => {
            emit('updateIsMaterials', newVal);
        })
        return {
            extensions,
            isMaterials,
        }
    }

};
</script>

<style scoped>

</style>