import { useState, useEffect } from 'react';

const useBpmnData = () => {
  const [bpmnData, setBpmnData] = useState('');
  const [bpmnAdministrative, setBpmnAdministrative] = useState('');
  const [bpmnMezved, setBpmnMezved] = useState('');
  const [bpmnMezvedCatalog, setBpmnMezvedCatalog] = useState('');

  useEffect(() => {
    const fetchData = async (endpoint, setData) => {
      try {
        const response = await fetch(
          (process.env.REACT_APP_API_URL || '') + endpoint,
        );
        const data = await response.text();
        setData(data);
        console.log(`Данные из ${endpoint}:`, data);
      } catch (error) {
        console.error(`Ошибка при получении данных ${endpoint}:`, error);
      }
    };

    fetchData('/api/bpmnData', setBpmnData);
    fetchData('/api/bpmnAdministrative', setBpmnAdministrative);
    fetchData('/api/bpmnMezved', setBpmnMezved);
    fetchData('/api/bpmnMezvedCatalog', setBpmnMezvedCatalog);
  }, []);

  return {
    bpmnData,
    bpmnAdministrative,
    bpmnMezved,
    bpmnMezvedCatalog,
  };
};

export default useBpmnData;
