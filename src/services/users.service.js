import {axiosInstance} from '@/utils/API';

class usersService {
    getUsers = async () => {
        const res = await axiosInstance.get('/users');
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching users');
    };
}
export default new usersService();
