import {axiosInstance} from '@/utils/API';

class FilesService {
    uploadFiles = async (formData) => {
        const res = await axiosInstance.post(`/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching Files');
    };

    updateFile = async (fileId, data) => {
        const res = await axiosInstance.patch(`/files/${fileId}`, data)

        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error update File');
    };

    getFile = async (file) => {
        const res = await axiosInstance.get(`/files/${file}/sign`)

        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error update File');
    }
}
export default new FilesService();
