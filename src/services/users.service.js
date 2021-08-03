import {axiosInstance} from '@/utils/API';

class usersService {
    getUsers = async () => {
        const res = await axiosInstance.get('/users');
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching users');
    };
    setNewRole = async (newRole, user) => {
        try {
            const newUser = {
                ...user,
                role: newRole,
                email: Date.now() + '@mydomain.com',
                login: Date.now() + 'login',
            };
            return await axiosInstance.patch(`/users/${user.id}`, newUser);
        } catch (e) {
            throw new Error('Ошибка при смене статуса пользователя');
        }
    };
}
export default new usersService();
