import { createSlice } from "@reduxjs/toolkit";


const initialState = { products:[] }


export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProduct:(state,action)=>{
            state.products = action.payload
        },
     addProduct:(state,action)=>{
            state.products.push(action.payload) 
     },
     removeProduct:(state,action)=>{
         state.products = state.products.filter(product => product._id !== action.payload);
     },
     updateProduct:(state,action)=>{
        state.products = state.products.map(product=>{
            if(product._id===action.payload._id){
                return action.payload
            }else{
                return product
            }
        })
     }
    }
})
export const { addProduct, setProduct,removeProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;
export const selectProducts = (state)=>state.products.products
