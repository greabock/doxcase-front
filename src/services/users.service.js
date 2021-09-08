import {axiosInstance} from '@/utils/API';

class usersService {
    getUsers = async () => {
        const res = await axiosInstance.get('/users');
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching users');
    };
    addUser = async (user) => {
        try {
            const res = await axiosInstance.post('/users', user);
            return res.data;
        } catch(e) {
           throw new Error('Ошибка добавления пользователя');
        }
    };
    setNewRole = async (newRole, user) => {
        try {
            const newUser = {
                ...user,
                role: newRole,
            };
            return await axiosInstance.patch(`/users/${user.id}`, newUser);
        } catch (e) {
            throw new Error('Ошибка при смене статуса пользователя');
        }
    };
}
export default new usersService();
