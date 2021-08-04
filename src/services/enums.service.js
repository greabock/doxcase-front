import {axiosInstance} from '@/utils/API';

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
        return await axiosInstance.post(`/enums`, {
            ...title,
            values: [],
        });
    };
}
export default new enumService();
