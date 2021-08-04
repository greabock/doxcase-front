import {axiosInstance} from '@/utils/API';
import {v4 as uuidv4} from 'uuid';

class enumService {
    getEnums = async () => {
        const res = await axiosInstance.get('/enums');
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching enums');
    };
    getEnumsItems = async (enumId) => {
        const res = await axiosInstance.get(`/enums/${enumId}`);
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching enum Object');
    };
    createEnum = async (title) => {
        const newEnum = {
            ...title,
            id: uuidv4(),
            values: [],
        };
        await axiosInstance.post(`/enums`, newEnum);
        return newEnum;
    };
    removeEnum = async (id) => {
        return await axiosInstance.delete(`/enums/${id}`);
    };
}
export default new enumService();
