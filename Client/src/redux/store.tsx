    import { configureStore } from "@reduxjs/toolkit";
    import { persistReducer, persistStore} from 'redux-persist'
    import storage from "redux-persist/lib/storage";
    import userReducer from './slices/userSlice';
    import authReducer from './slices/authSlice'

    const userPersistConfig = {
        key: "user",
        storage,
    };

    const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

    const store = configureStore({
        reducer: {
            auth: authReducer,
            user: persistedUserReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
            serializableCheck: false, 
            }),
    })
    export const persistor = persistStore(store);

    export type RootState = ReturnType<typeof store.getState>;
    export default store