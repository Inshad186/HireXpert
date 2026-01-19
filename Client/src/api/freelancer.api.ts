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

export const completeOnboarding = async() =>{
    try {
        const {data} = await Api.put(freelancerEndpointUrl.UPDATE_ISSELLER)
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

export const freelancerDashStats = async() => {
    try {
        const {data} = await Api.get(freelancerEndpointUrl.GET_FREELANCER_DASHSTATS)
        return {success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };   
    }
}

export const getOrderList = async() => {
    try {
        const {data} = await Api.get(freelancerEndpointUrl.GET_ORDERLIST)
        return {success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong"
        return {success: false, error: message}
    }
}

export const getOrders = async(orderId: string) => {
    try {
        const { data } = await Api.get(`${freelancerEndpointUrl.GET_ORDERS}/${orderId}`)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong"
        return { success: false, error: message}
    }
}



export const acceptOrder = async(orderId: string) => {
    try {
        const { data } = await Api.patch(`${freelancerEndpointUrl.ACCEPT_ORDER}/${orderId}`)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong"
        return { success: false, error: message}
    }
}

export const rejectOrder = async(orderId: string, reason: string) => {
    try {
        const { data } = await Api.patch(`${freelancerEndpointUrl.REJECT_ORDER}/${orderId}/${reason}`)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error
        return { success: false, error: message}
    }
}

export const inProgressOrder = async(orderId: string) => {
    try {
        const {data} = await Api.patch(`${freelancerEndpointUrl.INPROGRESS_ORDER}/${orderId}`)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error
        return { success: false, error: message}
    }
}

export const deliveryOrder = async(orderId: string, deliveryFiles: File[], deliveryNotes: string) => {
    try {
        const formData = new FormData()
        deliveryFiles.forEach((file) => {
            formData.append("files", file)
        })
        formData.append("deliveryNotes", deliveryNotes);
        const { data } = await Api.patch(`${freelancerEndpointUrl.DELIVERY_ORDER}/${orderId}`,formData)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error
        return { success: false, error: message}
    }
}

export const startStripeOnboarding = async() => {
    try {
        const { data } = await Api.post(freelancerEndpointUrl.STRIPE_ONBOARDING)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error
        return { success: false, error: message}
    }
}

export const getStripeStatus = async() => {
    try {
        const { data } = await Api.get(freelancerEndpointUrl.STRIPE_STATUS)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error
        return { success: false, error: message} 
    }
}
