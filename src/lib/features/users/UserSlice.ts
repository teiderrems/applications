import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type User={
    Email?:string
    Username?:string
    Role?:string
    id?:string
}

const initialState={}

const UserSlice=createSlice({
    name:"UserInfo",
    initialState,
    reducers:{
        loadState:(state,action)=>{
            let data=(JSON.parse(atob(action.payload.split('.')[1])));
            state={...state,Username:data.username,Email:data.email,id:data._id,Role:data.role};
            //return state;
        }
    },
});

export const {loadState}=UserSlice.actions;

export default UserSlice.reducer;