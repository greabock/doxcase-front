import {axiosInstance} from '@/utils/API';

class licenseService {
    getLicense = async () => {
        const res = await axiosInstance.get(`/license`);
        if (res.data) {
            return res.data;
        } else {
            throw new Error('License error');
        }
    };
    sendLicense = async (licenseKey) => {
        const res = await axiosInstance.post(`/license`, {key: licenseKey});
        if (res.status !== 200) {
            throw new Error('Error fetching material');
        }
    };
    deleteLicense = async () => {
        await axiosInstance.get(`/console/kb:license-delete`);
    }
}

export default new licenseService();