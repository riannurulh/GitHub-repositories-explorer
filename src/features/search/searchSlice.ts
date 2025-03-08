import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PostCreate from "../../helpers/PostRequest";

export interface User {
    login: string;
    id: number;
    avatar_url: string;
    repository?: Repository[];
}

export interface Repository {
    name: string;
    id: number;
    description: string;
    stargazers_count: number;
}

export interface Result {
    searchQuery: User[],
    loading: boolean,
    error: null | string,
}

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchQuery: [],
        loading: false,
        error: null,
    } as Result,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSearchQuery.fulfilled, (state, action) => {
            state.searchQuery = action.payload;
            state.loading = false
        })
        .addCase(fetchSearchQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(fetchSearchQuery.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        
    },
});

export const fetchSearchQuery = createAsyncThunk(
    "search/fetchSearchQuery",
    async (query: string,{rejectWithValue}) => {
        try {
            const users = await PostCreate({
                url: `/search/users?q=${query}&per_page=5`,
                method: "GET",
            })
            if (!users.data.items.length) {
                return rejectWithValue("No user found");
            }
            const usersRepositories = await Promise.all(
                users.data.items.map(async (user: User) => {
                    const repositories = await PostCreate({
                        url: `/users/${user.login}/repos`,
                        method: "GET",
                    });
                    return {
                        repository: repositories.data,
                        ...user,
                    }
                })
            )
            console.log(usersRepositories);
            
            return usersRepositories;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            if (typeof error === "object" && error !== null && "response" in error) {
                const err = error as { response?: { data?: { message?: string } } };
                return rejectWithValue(err.response?.data?.message || "Something went wrong");
            }
        
            return rejectWithValue("Unknown error occurred");
        }
    });


export default searchSlice.reducer;