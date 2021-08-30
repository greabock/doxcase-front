import {axiosInstance} from '@/utils/API';


class FileService {
    uploadFile = async (files) => {
        const res = await axiosInstance.post(`/files`, files, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching files');
    };
    getFile = async (id, label ) => {
        try {
            const response = await axiosInstance.get(`/files/${id}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = label
            link.click()
            URL.revokeObjectURL(link.href)

        } catch(e) {
            console.log(e)
        }
    }
}

export default new FileService();
