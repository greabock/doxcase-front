<template>
    <a :href="href" target="_blank" >
        <slot></slot>
    </a>
</template>

<script>
import fileService from '@/services/files.service';
import {ref} from 'vue';


export default {
    props: {
        id: String
    },
    setup(props) {
        const href = ref(null);

        const getFileLink = async () => {
            try {
                const temporaryLink = await fileService.getFileLink(props.id);
                href.value = temporaryLink
            } catch (e) {
                console.log(e);
            } 
        };

        getFileLink();

        return {
            href,
            getFileLink
        }
        
    }
}
</script>