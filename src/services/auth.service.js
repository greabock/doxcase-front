import {axiosInstance} from '../utils/API';

class AuthService {
    getToken = async ({login, password}) => {
        try {
            const resp = await axiosInstance.post('/auth/login', {
                login,
                password,
            });
            console.log('Hi');
            return resp.data.data?.token;
        } catch (e) {
            throw new Error('Ошибка авторизации');
        }
    };
    getUserInfo = async () => {
        try {
            return await axiosInstance.get('/auth/me');
        } catch (e) {
            console.log('Error fetching UserData');
        }
    };
}

export default new AuthService();
