<template>
    <div class="sAddDocs__item sAddDocs__item--edit">
        <div class="container-fluid">
            <div class="sAddDocs__inner">
                <VInput v-model="name" class="d-flex flex-grow-1 col-10" size="md" offsetRight="5rem" offsetLeft="3rem">
                    <template #left>
                        <div class="d-flex justify-content-center align-items-center w-100">
                            <svg class="icon fs-4">
                                <use xlink:href="/img/svg/sprite.svg#doc"></use>
                            </svg>
                        </div>
                    </template>
                    <template #right>
                        <div class="sAddDocs__btns align-items-center justify-content-center w-100" @click="save">
                            <div class="btn-edit-sm btn-success">
                                <svg class="icon icon-check">
                                    <use xlink:href="/img/svg/sprite.svg#check"></use>
                                </svg>
                            </div>
                            <div class="btn-edit-sm btn-danger" @click="$emit('close')">
                                <svg class="icon icon-close">
                                    <use xlink:href="/img/svg/sprite.svg#close"></use>
                                </svg>
                            </div>
                        </div>
                    </template>
                </VInput>
                <span class="sAddDocs__size d-none d-md-block">.{{ data.type }}({{ sizeFormat(data.size) }})</span>
            </div>
        </div>
    </div>
</template>

<script>
import VInput from '@/ui/VInput';
import {ref} from '@vue/reactivity';
import {sizeFormat} from '@/utils/helpers';

import fileService from '@/services/files.service';
import {computed} from '@vue/runtime-core';

export default {
    components: {
        VInput,
    },
    props: {
        id: String,
        file: File,
        data: Object,
    },
    setup(props, {emit}) {
        const name = ref(props.data.name);

        const isNew = computed(() => !!props.id);

        const save = async () => {
            if (!isNew.value) {
                const blob = props.file.slice(0, props.file.size, props.file.type);
                const newFile = new File([blob], `${name.value}.${props.data.type}`, {type: props.file.type});
                emit('saveFile', newFile);
            } else {
                const res = await fileService.updateFile(props.id, {
                    name: name.value,
                });
                console.log(res);

                console.log({
                    ...props.data,
                    name: name.value,
                });
                emit('updateData', {
                    ...props.data,
                    name: name.value,
                });
            }
        };

        return {
            sizeFormat,
            name,
            save,
            isNew,
        };
    },
};
</script>
