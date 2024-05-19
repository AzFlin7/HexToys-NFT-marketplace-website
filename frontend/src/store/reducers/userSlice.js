import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    user: null,
    account: null,
    status: 'idle'
}

export const setUserByFetch = createAsyncThunk(
    'user/fetchUser',
    async (account) => {
        try {
            let res = await axios.get(`${process.env.REACT_APP_API}/user_info/${account}`);
            if (res.data.status) {
                return res.data.user;
            }
        } catch (e) {
            return null;
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setUserByFetch.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(setUserByFetch.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action.payload;
            });
    },
});

export const {setUser, setAccount} = userSlice.actions;

export const getUser = (state) => state.userStore.user;
export const getAccount = (state) => state.userStore.account;

export default userSlice.reducer;
