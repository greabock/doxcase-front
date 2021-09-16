import {axiosInstance} from '@/utils/API';

class AuthService {
    getToken = async ({email, password}) => {
        try {
            const resp = await axiosInstance.post('/auth/login', {
                email,
                password,
            });
            return resp.data.data?.token;
        } catch (e) {
            throw new Error('Auth error');
        }
    };
    getUserInfo = async () => {
        try {
            const res = await axiosInstance.get('/auth/me');
            return res.data.data;
        } catch (e) {
            throw new Error('Error fetching User Data');
        }
    };
}

export default new AuthService();
