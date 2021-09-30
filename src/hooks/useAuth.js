import {useRouter} from 'vue-router';
import AuthService from '@/services/auth.service';
import licenseService from '@/services/license.service';
import {ref} from 'vue';
import {useStore} from 'vuex';

export function useAuth() {
    const router = useRouter();
    const error = ref(null);
    const loading = ref(false);
    const store = useStore();

    const handleLogin = async ({email, password}) => {
        try {
            loading.value = true;
            const token = await AuthService.getToken({email, password});
            localStorage.setItem('token', token);
            await store.dispatch('user/fetchUserData');
            const user = store.getters['user/getUser'];
            localStorage.setItem('role', user.role);
            const license = await licenseService.getLicense();
            if (!license || !license.expires_at) {
                loading.value = false;
                await router.push('/license');
            } else {
                await router.push('/');
            }
        } catch (e) {
            error.value = e.message;
        } finally{
            loading.value = false;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/auth');
    };

    const authCheck = () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
        if (!role || !token) {
            router.push('/auth');
        }
    };

    const skipError = () => {
      error.value = null;
    };

    return {
        handleLogin,
        handleLogout,
        authCheck,
        loading,
        error,
        router,
        store,
        skipError,
    };
}
