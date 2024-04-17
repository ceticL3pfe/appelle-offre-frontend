import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./api/apiSlice";
import userReducer from "../features/users/userSlice";
import productReducer from '../features/products/productSlice'
import saleReducer from "../features/sales/saleSlice";
const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["user",'token'], 
};
const productsPersistConfig = {
    key: "product",
    storage,
    whitelist: ["products"], 
};
const salesPersistConfig = {
    key: "sale",
    storage,
    whitelist: ["sales","price","count"], 
};

const userPersistedReducer = persistReducer(userPersistConfig, userReducer);
const productsPersistedReducer = persistReducer(productsPersistConfig, productReducer);
const salesPersistedReducer = persistReducer(salesPersistConfig, saleReducer);

const staticReducer = {

    user: userPersistedReducer,
    products: productsPersistedReducer,
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
