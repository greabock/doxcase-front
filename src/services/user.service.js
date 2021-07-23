import {API_URL} from '../../globals';
import axios from 'axios';
import authHeader from './auth-header';

class UserService {
    getPublicContent(url) {
        return axios.get(API_URL + url, {headers: authHeader()});
    }
}

export default new UserService();
