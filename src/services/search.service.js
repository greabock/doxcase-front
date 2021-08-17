import {axiosInstance} from '@/utils/API';

class SearchService {
    searchSection = async (id) => {
        const res = await axiosInstance.get(`/search/${id}`);
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching Search page');
    };
}
export default new SearchService();