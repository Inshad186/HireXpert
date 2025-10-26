import Api from "@/services/axios";
import { clientEndpointUrl } from "@/constants/endpointUrl";

export const updateClientProfile = async(data: any) => {
    try {
        const response = await Api.post(clientEndpointUrl.UPDATE_CLIENT_PROFILE, data)
        return { success: true, data: response.data };
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };        
    }
}

export const getProjects = async() => {
    try {
        const {data} = await Api.get(clientEndpointUrl.GET_GIGS)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };      
    }
}

export const getProjectDetails = async(projectId : string) => {
    try {
        const {data} = await Api.get(`${clientEndpointUrl.GET_PROJECTDETAIL}/${projectId}`)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message }; 
    }
}

export const createOrder = async(gigId:string, freelancerId:string ,requirements:string, selectedPlan:string) => {
    try {
        const {data} = await Api.post(clientEndpointUrl.CREATE_ORDER, {gigId, freelancerId, requirements, selectedPlan})
        return {success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };   
    }
}