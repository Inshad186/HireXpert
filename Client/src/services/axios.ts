import axios from "axios";
import store from "@/redux/store";
import { responses } from "@/constants/response.constants";
import { removeUser } from "@/redux/slices/userSlice";
import { endpointUrl } from "@/constants/endpointUrl";
import { setAccessToken, logout } from "@/redux/slices/authSlice";


const getAccessToken = () : string | null => {
    const state = store.getState()
    return state.auth.accessToken
}

const refreshToken = async (): Promise<string> => {
    const response = await Api.post(
        endpointUrl.REFRESH_TOKEN,
        {},
        { withCredentials: true }
    );

    const newAccessToken = response.data?.accessToken;

    if (!newAccessToken) {
        throw new Error("No access token returned");
    }
    store.dispatch(setAccessToken(newAccessToken));
    return newAccessToken;
};

const Api = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
    withCredentials: true
})

Api.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {}
        const token = getAccessToken()

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
                store.dispatch(logout())
                store.dispatch(removeUser());
                return Promise.reject(error);
            }

            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newToken = await refreshToken();
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return Api(originalRequest);
                } catch (refreshError) {
                    store.dispatch(logout())
                    store.dispatch(removeUser());
                    return Promise.reject(refreshError);
                }
            }
            if(status === 403){
                store.dispatch(logout())
                store.dispatch(removeUser())
            }
        }
        return Promise.reject(error)
    }
)
export default Api