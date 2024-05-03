import { createSlice } from "@reduxjs/toolkit";


const initialState = { tenders:[] }


export const tenderSlice = createSlice({
    name: 'tenders',
    initialState,
    reducers: {
        setTenders:(state,action)=>{
            state.tenders = action.payload
        },
     
     
    
    }
})
export const { setTenders } = tenderSlice.actions;
export default tenderSlice.reducer;
export const selectTenders = (state)=>state.tenders.tenders
