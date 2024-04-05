import {createSlice} from '@reduxjs/toolkit';

const initialState={
    theme:'light',
};

const themeSlice=createSlice({
    name:'theme',
    initialState,
    reducers:{
        //to reducers me ham apna function define krte hai
        toggleTheme:(state)=>{
            state.theme=state.theme==='light'?'dark':'light';
        },
    }
})

export const {toggleTheme}=themeSlice.actions;


export default themeSlice.reducer;