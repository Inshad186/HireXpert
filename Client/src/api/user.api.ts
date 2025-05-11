import { endpointUrl } from "@/constants/endpointUrl";
import Api from "@/services/axios";

const headers= {
    'X-User-Level': 'user'
}

export const resendOtp = async(email: string) => {
    try {
        await Api.post(endpointUrl.RESEND_OTP, {email}, {headers})
        return {success:true}
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong";
        return { success: false, error: message, data: {} };
    }
}

export const assignRole = async(role:string, email:string) => {
    try {
        await Api.patch(endpointUrl.ASSIGN_ROLE,{role, email},{headers})
        return {success : true}
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong";
        return { success: false, error: message, data: {} };
    }
}

export const userLogout = async() => {
    try {
        await Api.delete(endpointUrl.LOGOUT, {headers})
        return {success:true}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };
    }
}
