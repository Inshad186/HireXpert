import axios from "axios";
import store from "@/redux/store";
import { responses } from "@/constants/response.constants";
import { setUser, removeUser } from "@/redux/slices/userSlice";
import { endpointUrl } from "@/constants/endpointUrl";

const getUserLevelToken = () : string | null => {
    const state = store.getState()
    console.log("State  >>>>> : ",state)
    const token = state.user.accessToken
    console.log("Token >>>>>> : ",token)
    return token
}

const refreshToken = () => {
    const response = Api.post(endpointUrl.REFRESH_TOKEN, {}, {withCredentials:true}) as any
    console.log("REFRESH TOKEN RESPONSE >>>>> : ",response)
}

const Api = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials: true
})

Api.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {}
        const token = getUserLevelToken()
        console.log("Get User Level Token >> : ",token)

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

Api.interceptors.response.use(
    (response) => response ,
    async (error) => {
        const originalRequest = error.config

        if (error.response) {            
            const { status, data } = error.response;

            if (status === 403 || data.message === responses.USER_BLOCKED) {
                store.dispatch(removeUser());
                return Promise.reject(error);
            }

            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const userLevel = originalRequest.headers['X-User-Level'];
                    console.log("UserLevel from service axios : ",userLevel)
                    const newToken = await refreshToken();

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return Api(originalRequest);
                } catch (refreshError) {
                    if (originalRequest.headers['X-User-Level'] === 'user') { 
                        store.dispatch(removeUser());
                    }
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error)
    }
)
export default Api