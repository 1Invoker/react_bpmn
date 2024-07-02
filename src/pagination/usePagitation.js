import { useState, useEffect } from 'react';

const usePagination = (endpoint, page = 1, limit = 10) => {
  const [data, setData] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || ''}${endpoint}`,
        );
        const result = await response.json();
        setData(result);
        setTotalRecords(result.length);
        setCurrentPageData(result.slice((page - 1) * limit, page * limit));
        console.log(`Данные из ${endpoint}:`, result);
      } catch (error) {
        console.error(`Ошибка при получении данных ${endpoint}:`, error);
      }
      setLoading(false);
    };

    fetchData();
  }, [endpoint]);

  useEffect(() => {
    setCurrentPageData(data.slice((page - 1) * limit, page * limit));
  }, [data, page, limit]);

  return {
    data: currentPageData,
    totalRecords,
    loading,
  };
};

export default usePagination;
