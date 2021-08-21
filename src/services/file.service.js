import {axiosInstance} from '@/utils/API';
// import axios from 'axios';
// import {API_URL} from "@/globals";

class FileService {
    uploadFile = async (files) => {
        const res = await axiosInstance.post(`/files`, files, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.data) {
            return res.data.data;
        } else throw new Error('Error fetching files');
    };
}

export default new FileService();
