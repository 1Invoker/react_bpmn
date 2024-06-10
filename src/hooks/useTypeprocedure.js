import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTypeprocedure = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/bpmnAdministrative');
        setData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  const getTypeProcedures = () => {
    return data.map(item => item.typeprocedure);
  };

  return { data, error, getTypeProcedures };
};
