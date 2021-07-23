import axios from 'axios';
import {API_URL} from '../../globals';

class AuthService {
    async login({login, password}) {
        try {
            const resp = await axios.post(API_URL + '/auth/login', {
                login,
                password,
            });
            if (resp.data?.token) {
                localStorage.setItem('token', JSON.stringify(resp.data.token));
            }
            return await axios.get(API_URL + '/auth/login');
        } catch (e) {
            console.log(e);
        }
    }

    logout() {
        localStorage.removeItem('token');
    }
}

export default new AuthService();
