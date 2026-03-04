import Api from "@/services/axios";
import { messageEndpointUrl } from "@/constants/endpointUrl";

export const createMessage = async() => {
    try {
        const { data } = await Api.post(messageEndpointUrl.CREATE_MESSAGE)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message }; 
    }
}

export const getMessages = async(orderId: string) => {
    try {
        const { data } = await Api.get(`${messageEndpointUrl.GET_MESSAGES}/${orderId}`)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };   
    }
}

export const markAsRead = async() => {
    try {
        const { data } = await Api.patch(messageEndpointUrl.MARK_AS_READ)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };
    }
}