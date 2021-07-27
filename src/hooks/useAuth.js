import {useStore} from 'vuex';
import {computed} from 'vue';

export function useAuth() {
    const store = useStore();
    const role = computed(() => store.state.auth.role);
    const loading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);

    const handleLogin = ({login, password}) => {
        store.dispatch('auth/login', {login, password});
    };

    const logout = () => {
        store.dispatch('auth/logout');
    };

    return {
        role,
        handleLogin,
        logout,
        loading,
        error,
    };
}
