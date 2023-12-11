import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    selectedFile: null,
  },
  reducers: {
    selectFile: (state, action) => {
        console.log('Selected File:', action.payload);
      state.selectedFile = action.payload;
    },
    unselectFile: (state) => {
      state.selectedFile = null;
    },
  },
});

export const { selectFile, unselectFile } = fileSlice.actions;
export const selectSelectedFile = (state) => state.file.selectedFile;

export default fileSlice.reducer;