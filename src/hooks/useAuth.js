import {useRouter} from 'vue-router';
import AuthService from '../services/auth.service';
import {ref} from 'vue';
import {useStore} from 'vuex';

export function useAuth() {
    const router = useRouter();
    const error = ref(null);
    const loading = ref(false);
    const handleLogin = async ({login, password}) => {
        const store = useStore();

        try {
            loading.value = true;
            const token = await AuthService.getToken({login, password});
            localStorage.setItem('token', token);
            await store.dispatch('fetchUserData');
            await router.push('/');
        } catch (e) {
            loading.value = false;
            error.value = e.message;
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

    return {
        handleLogin,
        handleLogout,
        authCheck,
        loading,
        error,
        router,
    };
}
