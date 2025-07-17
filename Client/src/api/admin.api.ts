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

export const getUsersList = async(page:number, limit:number, role:string, search: string, status: string) => {
    try {
        const {data} = await Api.get(`${adminEndpointUrl.USERS_LIST}?page=${page}&limit=${limit}&role=${role}&search=${search}&status=${status}`)
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

export const addCategories = async(name : string) => {
    try {
        const {data} = await Api.post(adminEndpointUrl.ADD_CATEGORIES, {name})
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };
    }
}

export const getCategories = async() => {
    try {
        const {data} = await Api.get(adminEndpointUrl.GET_CATEGORIES)
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };  
    }
}

export const addSkills = async(name : string, category: string) => {
    try {
        const {data} = await Api.post(adminEndpointUrl.ADD_SKILLS, {name, category})
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

export const editSkills = async(skillId:string, skillName: string) => {
    try {
        const {data} = await Api.patch(adminEndpointUrl.EDIT_SKILLS, {skillId, skillName})
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message }; 
    }
}

export const deleteCategoryAndSkills = async(categoryId: string) => {
    try {
        const {data} = await Api.delete(`${adminEndpointUrl.DELETE_CATEGORY_AND_SKILL}/${categoryId}`)
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };  
    }
}


