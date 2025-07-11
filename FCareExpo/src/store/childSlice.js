import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { childApi } from '../utils/childApi';

// Async thunks
export const fetchAssignedChildren = createAsyncThunk(
  'child/fetchAssignedChildren',
  async (userId) => {
    const response = await childApi.getChildrenWithAssignment(userId);
    return response.data;
  }
);

export const fetchChildrenByUser = createAsyncThunk(
  'child/fetchChildrenByUser',
  async (userId) => {
    const response = await childApi.getChildrenByUser(userId);
    return response.data;
  }
);

export const fetchAllAssignedChildrenForParent = createAsyncThunk(
  'child/fetchAllAssignedChildrenForParent',
  async () => {
    const response = await childApi.getAllAssignedChildrenForParent();
    return response.data;
  }
);

const initialState = {
  assignedChildren: [],
  loading: false,
  error: null,
};

const childSlice = createSlice({
  name: 'child',
  initialState,
  reducers: {
    clearChildren: (state) => {
      state.assignedChildren = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAssignedChildren
      .addCase(fetchAssignedChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedChildren = action.payload;
      })
      .addCase(fetchAssignedChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetchChildrenByUser
      .addCase(fetchChildrenByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildrenByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedChildren = action.payload;
      })
      .addCase(fetchChildrenByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetchAllAssignedChildrenForParent
      .addCase(fetchAllAssignedChildrenForParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAssignedChildrenForParent.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedChildren = action.payload;
      })
      .addCase(fetchAllAssignedChildrenForParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearChildren, clearError } = childSlice.actions;
export default childSlice.reducer; 