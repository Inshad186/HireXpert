
export interface UserSignUpType {
    name : string,
    email : string,
    password : string,
    confirmPassword : string 
    role? : "freelancer" | "client" | "admin" | "none" | ""
}


export type UserSignupAction =
    | { type: "SET_NAME"; payload: string }
    | { type: "SET_EMAIL"; payload: string }
    | { type: "SET_PASSWORD"; payload: string }
    | { type: "SET_CONFIRM_PASSWORD"; payload: string }


export interface ErrorState {
    field?: string;
    message?: string;
}

export interface UserStoreType {
    _id: string;
    name: string;
    email: string;
}