import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    files: [],
    selectedFile: null,
    xsdXmls: [],
  },
  reducers: {
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action) => {
      const fileNameToRemove = action.payload;
      state.files = state.files.filter(
        file => file.fileName !== fileNameToRemove,
      );
    },
    selectFile: (state, action) => {
      state.selectedFile = {
        fileName: action.payload.fileName,
        xml: action.payload.xml,
      };
    },
    unselectFile: state => {
      state.selectedFile = null;
    },
    setXsdXmls: (state, action) => {
      state.xsdXmls = action.payload;
    },
  },
});

export const { addFile, removeFile, selectFile, unselectFile, setXsdXmls } =
  fileSlice.actions;
export const selectFiles = state => state.file.files;
export const selectSelectedFile = state => state.file.selectedFile;
export const selectXsdXmls = state => state.file.xsdXmls;

export default fileSlice.reducer;
