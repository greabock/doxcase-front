import {useRouter} from 'vue-router';
import AuthService from '../services/auth.service';
import {ref} from 'vue';

export function useAuth() {
    const router = useRouter();
    const error = ref(null);
    const loading = ref(false);
    const handleLogin = async ({login, password}) => {
        try {
            loading.value = true;
            const token = await AuthService.getToken({login, password});
            localStorage.setItem('token', token);
            // const userReq = await AuthService.getUserInfo();
            // localStorage.setItem('role', userReq.role);
            loading.value = false;
            await router.push('/');
        } catch (e) {
            loading.value = false;
            error.value = e.response?.data?.message || e.message || e.toString();
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
