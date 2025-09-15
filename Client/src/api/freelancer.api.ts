import Api from "@/services/axios";
import { freelancerEndpointUrl} from "@/constants/endpointUrl";

export const updateFreelancerProfile = async(data: any) => {
    try {
        const response = await Api.post(freelancerEndpointUrl.UPDATE_FREELANCER_PROFILE, data)
        return { success: true, data: response.data };
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };        
    }
}

export const getGigList = async() => {
    try {
        const {data} = await Api.get(freelancerEndpointUrl.LISTED_GIG)
        return {success: true, data}
    } catch (error : any) {
        const message = error.response?.data?.error || "Something went wrong"
        return { success: false, error: message}
    }
}


export const createGig = async(formData: FormData) => {
    try {
        const {data} = await Api.post(freelancerEndpointUrl.CREATE_GIG, formData)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };  
    }
}

export const updateGigStatus = async(id:string, currentStatus:boolean) => {
    try {
        const {data} = await Api.put(freelancerEndpointUrl.UPDATE_GIG_STATUS, {id, currentStatus})
        return {success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };   
    }
}