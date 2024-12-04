import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getPageQuery } from "../pagination";

export const paginationSlice = createSlice({
    name: "pagination",
    initialState: {
        page: getPageQuery().page,
    },
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
    },
});

export const { setPage } = paginationSlice.actions;

export const selectPage = (state: RootState) => state.pagination.page;