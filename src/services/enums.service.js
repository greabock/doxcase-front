import {axiosInstance} from '@/utils/API';

class enumService {
    getEnums = async () => {
        const res = await axiosInstance.get('/enums');
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching enums');
    };
}
export default new enumService();
