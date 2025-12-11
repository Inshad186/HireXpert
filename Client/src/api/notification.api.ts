import Api from "@/services/axios";
import { notificationEndpointUrl } from "@/constants/endpointUrl";

export const getNotification = async() => {
    try {
        const { data } = await Api.get(notificationEndpointUrl.GET_NOTIFICATION)
        return { success: true, data}
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong";
        return { success: false, error: message}
    }
}