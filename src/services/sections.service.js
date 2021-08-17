import {axiosInstance} from '@/utils/API';
// import {v4 as uuidv4} from 'uuid';

class sectionsService {
    //Sections _______________________________
    getSections = async () => {
        const res = await axiosInstance.get('/sections');
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching sections');
    };
    getSectionObject = async (id) => {
        const res = await axiosInstance.get(`/sections/${id}`);
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching section');
    }
    updateSectionsList = async (sections) => {
        const res = await axiosInstance.patch('/sections', sections);
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error updating sections');
    };
    updateSection = async (section) => {
        const res = await axiosInstance.patch(`/sections/${section.id}`, section);
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error updating sections');
    };
    createSection = async (section) => {
        const res = await axiosInstance.post('/sections', section);
        if (res.data?.data) {
            return res.data.data;
        } else throw new Error('Section Creation Error');
    };

    removeSection = async (id) => {
        await axiosInstance.delete(`/sections/${id}`);
    };
}

export default new sectionsService();
