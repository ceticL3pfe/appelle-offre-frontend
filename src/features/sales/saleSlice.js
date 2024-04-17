import { createSlice } from "@reduxjs/toolkit";


const initialState = { sales: [] }


export const saleSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        setSaleToStore: (state, action) => {
            console.log(action.payload)
            state.sales = action.payload
        },
        addSaleToStore: (state, action) => {
            state.sales.push(action.payload)
        },
        removeSalesFromStore: (state, action) => {
            const idsToRemove = action.payload;
            state.sales = state.sales.filter(sale => !idsToRemove.includes(sale._id));
        },

        updateSaleInStore: (state, action) => {
            state.sales = state.sales.map(sale => {
                if (sale._id === action.payload._id) {
                    return action.payload
                } else {
                    return sale
                }
            })
        },

    }
})
export const { addSaleToStore, setSaleToStore, removeSalesFromStore, updateSaleInStore } = saleSlice.actions;
export default saleSlice.reducer;
export const selectSales = (state) => state.sales.sales

