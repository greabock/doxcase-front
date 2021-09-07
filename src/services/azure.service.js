import {axiosInstance} from '@/utils/API';

class azureService {
    getAzure = async () => {
        try {
            return await axiosInstance.get('/auth/azure/redirect', );
        } catch (e) {
            throw new Error('Azure get error');
        }
    };
    postAzure = async (queryObj) => {
        try {
            return await axiosInstance.post('/auth/azure/login', queryObj);
        } catch (e) {
            throw new Error('Error fetching User Data');
        }
    };
}

export default new azureService();
