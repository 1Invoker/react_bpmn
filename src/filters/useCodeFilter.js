import { useState } from 'react';

const useCodefilter = (data, typeRegCode) => {
  const [searchCode, setSearchCode] = useState('');

  const filteredByCode = data.filter((file, index) => {
    return searchCode === '' || typeRegCode[index]?.startsWith(searchCode);
  });

  return {
    searchCode,
    setSearchCode,
    filteredByCode,
  };
};

export default useCodefilter;
