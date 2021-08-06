import {axiosInstance} from '@/utils/API';
import {v4 as uuidv4} from 'uuid';

class enumService {
    // Enums _______________________________
    getEnums = async () => {
        const res = await axiosInstance.get('/enums');
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching enums');
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

    // Items in Enum.values________________________________
    getEnumsObject = async (enumId) => {
        const res = await axiosInstance.get(`/enums/${enumId}`);
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching enum Object');
    };
    addEnumsItem = async (myEnum, title) => {
        const newEnumItem = {
            ...title,
            id: uuidv4(),
        };
        const newEnum = {
            ...myEnum,
            values: [newEnumItem, ...myEnum.values],
        };
        await axiosInstance.patch(`/enums/${myEnum.id}`, newEnum);
        return newEnum;
    };
    removeEnumsItem = async (myEnum, enumItemId) => {
        const newEnum = {
            ...myEnum,
            values: [...myEnum.values].filter((item) => item.id !== enumItemId),
        };
        await axiosInstance.patch(`/enums/${myEnum.id}`, newEnum);
        return newEnum;
    };
}
export default new enumService();
