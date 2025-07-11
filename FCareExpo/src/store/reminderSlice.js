import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reminderApi } from '../utils/reminderApi';

// Async thunks
export const fetchRemindersByChild = createAsyncThunk(
  'reminder/fetchRemindersByChild',
  async (childId, { rejectWithValue }) => {
    try {
      const response = await reminderApi.getRemindersByChild(childId);
      // response = mảng, nên return trực tiếp
      return response; 
    } catch (err) {
      return rejectWithValue(err.message || 'Lỗi không xác định');
    }
  }
);

export const createReminder = createAsyncThunk(
  'reminder/createReminder',
  async (reminderData) => {
    const response = await reminderApi.createReminder(reminderData);
    return response.data;
  }
);

export const updateReminder = createAsyncThunk(
  'reminder/updateReminder',
  async ({ id, reminderData }) => {
    const response = await reminderApi.updateReminder(id, reminderData);
    return response.data;
  }
);

export const deleteReminder = createAsyncThunk(
  'reminder/deleteReminder',
  async (reminderId) => {
    await reminderApi.deleteReminder(reminderId);
    return reminderId;
  }
);

const initialState = {
  reminders: [],
  selectedChild: null,
  loading: false,
  error: null,
};

const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    setSelectedChild: (state, action) => {
      state.selectedChild = action.payload;
    },
    clearReminders: (state) => {
      state.reminders = [];
      state.selectedChild = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRemindersByChild
      .addCase(fetchRemindersByChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemindersByChild.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = action.payload;
      })
      .addCase(fetchRemindersByChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // createReminder
      .addCase(createReminder.fulfilled, (state, action) => {
        state.reminders.push(action.payload);
      })
      // updateReminder
      .addCase(updateReminder.fulfilled, (state, action) => {
        const index = state.reminders.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.reminders[index] = action.payload;
        }
      })
      // deleteReminder
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter(r => r._id !== action.payload);
      });
  },
});

export const { setSelectedChild, clearReminders, clearError } = reminderSlice.actions;
export default reminderSlice.reducer; 