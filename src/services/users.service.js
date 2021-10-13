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
           if (e.response && e.response.status === 422) {
               throw new Error('email occupied')
           }
           throw new Error('Ошибка добавления пользователя');
        }
    };
    updateUser = async (id, user) => {
        try {
            const res = await axiosInstance.patch(`/users/${id}`, user);
            return res.data;
        } catch(e) {
            if (e.response && e.response.status === 422) {
                throw new Error('email occupied')
            }
            throw new Error('Ошибка обновления пользователя');
        }
    };
    removeUser = async (id) => {
        try {
            return await axiosInstance.delete(`/users/${id}`);
        } catch(e) {
            throw new Error('Ошибка удаления пользователя');
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
