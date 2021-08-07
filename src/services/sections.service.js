import {axiosInstance} from '@/utils/API';
// import {v4 as uuidv4} from 'uuid';

class sectionService {
    //Sections _______________________________
    getSections = async () => {
        const res = await axiosInstance.get('/sections');
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching sections');
    };

    updateSectionsList = async (sections) => {
        const res = await axiosInstance.patch('/sections', sections);
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error updating sections');
    };

    removeSection = async (id) => {
        await axiosInstance.delete(`/sections/${id}`);
    };
}

export default new sectionService();
