import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import userReducer from './slices/userSlice';


const userPersistConfig = {
    key: "user",
    storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        user: persistedUserReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, 
        }),
})

const persistor = persistStore(store)
export {persistor}

export type RootState = ReturnType<typeof store.getState>;
export default store