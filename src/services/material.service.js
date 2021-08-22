import {axiosInstance} from '@/utils/API';
// import {v4 as uuidv4} from 'uuid';

class materialService {
    getMaterials = async (sectionId) => {
        const res = await axiosInstance.get(`/sections/${sectionId}/materials`);

        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching materials');
    };
    getMaterial = async (sectionId, materialId) => {
        const res = await axiosInstance.get(`/sections/${sectionId}/materials/${materialId}`);

        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching material');
    };
    createMaterial = async (sectionId, material) => {
        const res = await axiosInstance.post(`/sections/${sectionId}/materials`, material);

        if (res.data?.data) {
            return res.data.data;
        } else throw new Error('Material Creation Error');
    };
    updateMaterial = async (sectionId, materialId, material) => {
        const res = await axiosInstance.patch(`/sections/${sectionId}/materials/${materialId}`, material);

        if (res.data?.data) {
            return res.data.data;
        } else throw new Error('Material Update Error');
    };
    removeMaterial = async (sectionId, materialId) => {
        await axiosInstance.delete(`/sections/${sectionId}/materials/${materialId}`);
    };
}

export default new materialService();
