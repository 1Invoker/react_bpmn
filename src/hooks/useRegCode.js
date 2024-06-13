import { useState, useEffect } from 'react';
import axios from 'axios';

export const useRegCode = () => {
  const [data, setData] = useState([]);
  const [errorReg, setError] = useState(null);

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
        console.errorReg('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const getRegCodes = () => {
    return data.map(item => item.registercode);
  };

  return { data, errorReg, getRegCodes };
};
