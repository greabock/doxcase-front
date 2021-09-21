<template>
    <main class="main-block">
        <div class="section">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <span v-if="isPreloaderShown" class="spinner-border"></span>
                        <a v-else :href="privateLink"> Временная ссылка </a>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import {ref} from 'vue';
import {useRoute} from 'vue-router';
import fileService from '@/services/files.service';

export default {
    setup() {
        const privateLink = ref('');
        const isPreloaderShown = ref(true);

        const route = useRoute();
        const {link} = route.params;

        const getFileLink = async () => {
            isPreloaderShown.value = true;
            try {
                const temporaryLink = await fileService.getFileLink(link);
                privateLink.value = temporaryLink;
                window.open(temporaryLink, '_blank');
            } catch (e) {
                console.log(e);
            } finally {
                isPreloaderShown.value = false;
            }
        };

        getFileLink();

        return {
            privateLink,
            isPreloaderShown,
        };
    },
};
</script>

<style lang="scss" scoped>
.spinner-border {
    color: #1d47d5;
}
</style>