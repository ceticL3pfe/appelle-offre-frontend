import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./api/apiSlice";
import userReducer from "../features/users/userSlice";
import tenderReducer from '../features/tenders/tender'
const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["user",'token'], 
};
const tendersPersistConfig = {
    key: "tender",
    storage,
    whitelist: ["tenders"], 
};


const userPersistedReducer = persistReducer(userPersistConfig, userReducer);
const tendersPersistedReducer = persistReducer(tendersPersistConfig, tenderReducer);

const staticReducer = {

    user: userPersistedReducer,
    tenders: tendersPersistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
};

const createReducer = (asyncReducer = {}) => {
    return combineReducers({
        ...staticReducer,
    });
};


export const store = configureStore({
    reducer:createReducer() ,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export const persistor = persistStore(store);
