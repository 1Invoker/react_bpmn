import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTypeprocedure = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl =
        (process.env.REACT_APP_API_URL || '') + '/api/bpmnAdministrative';
      console.log('Requesting data from:', apiUrl);

      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const getTypeProcedures = () => {
    return data.map(item => item.typeprocedure);
  };

  return { data, error, getTypeProcedures };
};
