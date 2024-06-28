import { useState } from 'react';

const useProcedureFilter = (data, typeProcedures) => {
  const [selectedProcedureType, setSelectedProcedureType] = useState('');

  const filteredByProcedureType = data.filter((file, index) => {
    return (
      selectedProcedureType === '' ||
      typeProcedures[index] === selectedProcedureType
    );
  });

  return {
    selectedProcedureType,
    setSelectedProcedureType,
    filteredByProcedureType,
  };
};

export default useProcedureFilter;
