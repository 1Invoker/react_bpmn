import { useDispatch, useSelector } from 'react-redux';
import {
  addFile,
  selectFile,
  selectFiles,
  selectSelectedFile,
} from '../Redux/fileSlice';

export const useReduxFiles = () => {
  const dispatch = useDispatch();
  const files = useSelector(selectFiles);
  const selectedFile = useSelector(selectSelectedFile);

  const handleFileUpload = newFile => {
    dispatch(addFile(newFile));
  };

  const handleFileSelect = (fileName, xml) => {
    dispatch(selectFile({ fileName, xml }));
  };

  return {
    files,
    selectedFile,
    handleFileUpload,
    handleFileSelect,
  };
};
