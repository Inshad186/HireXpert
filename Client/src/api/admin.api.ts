import { adminEndpointUrl, endpointUrl } from "@/constants/endpointUrl";
import Api from "@/services/axios";

export const login = async (email: string, password: string) => {
    try {
        const { data } = await Api.post(adminEndpointUrl.LOGIN, { email, password });
        return { success: true, data };
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message }; 
    }
};

export const getTotalUsers = async() => {
    try {
        const {data} = await Api.get(adminEndpointUrl.TOTAL_USERS)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message }; 
    }
}