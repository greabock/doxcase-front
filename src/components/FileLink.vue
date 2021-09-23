<template>
    <a @click.prevent="getFileLink" target="_blank" href="#" >
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
                let win = window;
                win.open = function(url) {
                    win.location = url;
                    win.focus();
                }

                win.open(temporaryLink, '_blank');
            } catch (e) {
                console.log(e);
            } 
        };

        return {
            href,
            getFileLink
        }
        
    }
}
</script>