import {axiosInstance} from '@/utils/API';

class SearchService {
    uploadFiles = async (formData) => {
        const res = await axiosInstance.post(`/files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            );
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching Search page');
    };
}
export default new SearchService;
