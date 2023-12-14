import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    files: [], // Массив для хранения всех загруженных файлов
    selectedFile: null,
  },
  reducers: {
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action) => {
      const fileNameToRemove = action.payload;
      state.files = state.files.filter((file) => file.fileName !== fileNameToRemove);
    },
    selectFile: (state, action) => {
      // Обновление данных XML при выборе файла
      state.selectedFile = {
        fileName: action.payload.fileName,
        xml: action.payload.xml,
      };
    },
    unselectFile: (state) => {
      state.selectedFile = null;
    },
  },
});

export const { addFile, removeFile, selectFile, unselectFile } = fileSlice.actions;
export const selectFiles = (state) => state.file.files;
export const selectSelectedFile = (state) => state.file.selectedFile;

export default fileSlice.reducer;
