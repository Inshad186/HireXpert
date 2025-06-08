import { endpointUrl } from "@/constants/endpointUrl";
import Api from "@/services/axios";
import { UserSignUpType } from "@/types/user.type";

export const signup = async(formData : UserSignUpType) => {
    try {
        const {data} = await Api.post(endpointUrl.SIGNUP,formData)
        return {success : true, data}
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong";
        return { success: false, error: message, data: {} };        
    }
}

export const login = async (formData: any) => {
    try {
        const {data} = await Api.post(endpointUrl.LOGIN, formData)
        return {success : true , data}
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong";
        return { success: false, error: message, data: {} };  
    }
}

export const googleAuth = async (user: Omit<UserSignUpType, "password"> & {profilePicture?: string;}) => {
    try {
      const { data } = await Api.post(endpointUrl.GOOGLE_AUTH,{user});      
      return { success: true, data }
    } catch (error) {
        const err = error as any
        const message = err.response?.data?.error || "Something went wrong"
        return { success:false, error:message, data:{} };
    }
};

export const resendOtp = async(email: string) => {
    try {
        await Api.post(endpointUrl.RESEND_OTP, {email})
        return {success:true}
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong";
        return { success: false, error: message, data: {} };
    }
}

export const assignRole = async(role:string, email:string) => {
    try {
        await Api.patch(endpointUrl.ASSIGN_ROLE,{role, email})
        return {success : true}
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong";
        return { success: false, error: message, data: {} };
    }
}

export const changeProfile = async (formData: FormData) => {
    try {
        const { data } = await Api.post(endpointUrl.CHANGE_PROFILE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return { success: true, data } as any
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong.";
        return { success: false, error: message, data: {} };
    }
};

export const getProfileImage = async()=>{
    try {
        const {data} = await Api.get(endpointUrl.GET_PROFILE_IMAGE)
        return {success : true, data} as any
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong.";
        return { success: false, error: message, data: {} };  
    }
}

export const editUserName = async(name:string) => {
    try {
        const {data} = await Api.patch(endpointUrl.EDIT_USER_NAME, {name})
        return {success : true, data}
    } catch (error) {
        const err = error as any;
        const message = err.response?.data?.error || "Something went wrong";
        return { success: false, error: message, data: {} };
    }
}

export const getFreelancer = async() =>{
    try {
        const {data} = await Api.get(endpointUrl.GET_FREELANCER, )
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };       
    }
}

export const verifyOtp = async(email:string, otp:string, apiType:string) => {
    try {
        const {data} = await Api.post(endpointUrl.VERIFY_OTP,{email, otp, apiType})
        return { success: true, data};
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };    
    }
}

export const forgetPassword = async(email: string)=>{
    try {
        const {data} = await Api.post(endpointUrl.FORGET_PASSWORD, {email})
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };  
    }
}

export const fpVerifyOtp = async(otp:string, email:string) => {
    try {
        const {data} = await Api.post(endpointUrl.FP_VERIFY_OTP, {otp, email})
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };  
    }
}

export const resetPassword = async (email: string, password: string) => {
    try {
        const {data} = await Api.post(endpointUrl.RESET_PASSWORD, {email, password})
        return {success : true, data}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };    
    }
}

export const updateUserDetails = async(data: any) => {
    try {
        const response = await Api.post(endpointUrl.UPDATE_USERDETAILS, data)
        return { success: true, data: response.data };
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };        
    }
}

export const userLogout = async() => {
    try {
        await Api.delete(endpointUrl.LOGOUT)
        return {success:true}
    } catch (error) {
        const err = error as any
        const message = err.respose?.data?.error || "Something went wrong"
        return { success:false, error:message };
    }
}
