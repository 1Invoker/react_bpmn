import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const useFilesFromStore = () => {
  const files = useSelector(state => state.file.files);

  const xmlArray = useMemo(() => {
    return Object.values(files).map(file => file.xml);
  }, [files]);

  return xmlArray;
};

export default useFilesFromStore;
