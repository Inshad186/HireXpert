import Api from "@/services/axios";
import { clientEndpointUrl } from "@/constants/endpointUrl";
import { Filters } from "@/types/user.type";

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

export const getProjects = async(filters: Partial<Filters> = {}) => {
    try {
        const params: Record<string, string> = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.minRating) params.minRating = filters.minRating;
        const {data} = await Api.get(clientEndpointUrl.GET_GIGS, {params})
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

export const getFreelancerReviews = async(projectId: string) => {
    try {
        const { data } = await Api.get(`${clientEndpointUrl.GET_REVIEWS}/${projectId}`)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };    
    }
}

export const createPaymentIntent = async(gigId: string, plan: string) => {
    try {
        const {data} = await Api.post(clientEndpointUrl.CREATE_PAYMENT_INTENT, {gigId, plan})
        return {success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong"
        return { success: false, error: message}
    }
}

export const createOrder = async( gigId:string, requirements:string, selectedPlan:string, paymentIntentId: string ) => {
    try {
        const {data} = await Api.post(clientEndpointUrl.CREATE_ORDER, {gigId, requirements, selectedPlan, paymentIntentId })
        return {success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };   
    }
}

export const getMyOrders = async() => {
    try {
        const {data} = await Api.get(clientEndpointUrl.GET_MYORDERS)
        return {success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong"
        return {success: false, error: message}
    }
}

export const accept_Delivery = async(orderId: string, feedback: string, rating: number) => {
    try {
        const { data } = await Api.patch(`${clientEndpointUrl.ACCEPT_ORDERS}/${orderId}`,{feedback, rating})
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong"
        return { success: false, error: message}
    }
}

export const request_Revision = async(orderId: string, revisionReason: string ) => {
    try {
        const { data } = await Api.patch(`${clientEndpointUrl.REQUEST_REVISION}/${orderId}`, {revisionReason})
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong"
        return { success: false, error: message}
    }    
}