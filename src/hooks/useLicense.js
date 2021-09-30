import {useRouter} from 'vue-router';
import licenseService from '@/services/license.service';
import {ref} from 'vue';
import {useStore} from 'vuex';

export function useLicense() {
    const router = useRouter();
    const error = ref(null);
    const loading = ref(false);
    const store = useStore();

    const handleLicense = async ({prodKey}) => {
        try {
            loading.value = true;
            await licenseService.sendLicense(prodKey);
            await router.push('/');
        } catch (e) {
            error.value = e.message;
        } finally{
            loading.value = false;
        }
    };

    const skipError = () => {
        error.value = null;
    };

    return {
        handleLicense,
        loading,
        error,
        router,
        store,
        skipError,
    };
}
