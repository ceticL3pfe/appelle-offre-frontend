import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./api/apiSlice";
import userReducer from "../features/users/userSlice";
import tenderReducer from '../features/tenders/tender'
import saleReducer from "../features/sales/saleSlice";
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
const salesPersistConfig = {
    key: "sale",
    storage,
    whitelist: ["sales","price","count"], 
};

const userPersistedReducer = persistReducer(userPersistConfig, userReducer);
const tendersPersistedReducer = persistReducer(tendersPersistConfig, tenderReducer);
const salesPersistedReducer = persistReducer(salesPersistConfig, saleReducer);

const staticReducer = {

    user: userPersistedReducer,
    tenders: tendersPersistedReducer,
    sales: salesPersistedReducer,
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
