import {useStore} from 'vuex';
import {computed, onBeforeMount} from 'vue';
import {useRouter} from 'vue-router';
import Cookies from 'js-cookie';

export function useAuth() {
    const store = useStore();
    const router = useRouter();
    const loading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);
    const isAuth = computed(() => store.state.auth.isAuth);

    const handleLogin = ({login, password}) => {
        store.dispatch('auth/login', {login, password});
    };

    const logout = () => {
        store.dispatch('auth/logout');
        router.push('/login');
    };

    const role = Cookies.get('role');
    const token = Cookies.get('token');

    onBeforeMount(() => {
        if (!role || !token) {
            router.push('/login');
        }
    });

    return {
        handleLogin,
        logout,
        loading,
        error,
        role,
        store,
        isAuth,
        router,
    };
}
