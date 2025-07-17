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