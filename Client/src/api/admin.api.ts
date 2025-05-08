import { adminEndpointUrl } from "@/constants/endpointUrl";
import Api from "@/services/axios";

export const login = async (email: string, password: string) => {
    try {
        const { data } = await Api.post(adminEndpointUrl.LOGIN, { email, password });
        return { success: true, data };
    } catch (err) {
        console.error(err);
        return { success: false, error: err };
    }
};
