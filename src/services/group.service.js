import {axiosInstance} from '@/utils/API';

class usersService {
    getAllGroups = async () => {
        const res = await axiosInstance.get('/groups');
        if (res.data?.data) {
            return res.data.data;
        } else {
            return [];
        }
        // } else throw new Error('Ошибка при получении групп пользователей');
    };
    getOneGroup = async (id) => {
        const res = await axiosInstance.get(`/groups/${id}`);
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Ошибка при получении группы пользователей');
    };
    addGroup = async (group) => {
        try {
            const res = await axiosInstance.post('/groups', group);
            return res.data;
        } catch(e) {
            throw new Error('Ошибка добавления группы пользователей');
        }
    };
    removeGroup = async (id) => {
        try {
            return await axiosInstance.delete(`/groups/${id}`);
        } catch(e) {
            throw new Error('Ошибка добавления группы пользователей');
        }
    };
    updateGroup = async (group) => {
        try {
            return await axiosInstance.patch(`/users/${group.id}`, group);
        } catch (e) {
            throw new Error('Ошибка при обновлении группы пользователей');
        }
    };
}
export default new usersService();
