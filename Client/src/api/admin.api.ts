import { adminEndpointUrl } from "@/constants/endpointUrl";
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

export const getDashboardStats = async() => {
    try {
        const {data} = await Api.get(adminEndpointUrl.DASHBOARD_STATS)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message }; 
    }
}

export const getUsersList = async() => {
    try {
        const {data} = await Api.get(adminEndpointUrl.USERS_LIST)
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message }; 
    }
}

export const blockUsers = async(userId : string) => {
    try {
        const {data} = await Api.patch(adminEndpointUrl.BLOCK_USER, {userId})
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };
    }
}


export const getSkills = async() => {
    try {
        const {data} = await Api.get(adminEndpointUrl.GET_SKILLS)
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };    
    }
}

