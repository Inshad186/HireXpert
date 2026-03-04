import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStoreType } from "../../types/user.type";

const initialState : UserStoreType = {
    _id : '',
    name : '',
    email : '',
    role : '',
    createdAt : new Date(),
    updatedAt : new Date(),
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        setUser:(state, action: PayloadAction<UserStoreType>) => {
            return { ...state, ...action.payload}
        },
        removeUser:() => {
            return initialState
        },
    }
})

export const {setUser, removeUser} = userSlice.actions
export default userSlice.reducer