import { useState, useEffect } from 'react';
import axios from 'axios';

const useExecutionTime = () => {
  const [executionTimes, setExecutionTimes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl =
        (process.env.REACT_APP_API_URL || '') + '/api/bpmnAdministrative';
      console.log('Requesting data from:', apiUrl);

      try {
        const response = await axios.get(apiUrl);
        const bpmnAdministrative = response.data;

        if (bpmnAdministrative && bpmnAdministrative.length > 0) {
          const times = bpmnAdministrative.map(item => {
            if (item.xml) {
              const extractedTime = extractExecutionTime(item.xml);
              return { fileName: item.fileName, executionTime: extractedTime };
            }
            return {
              fileName: item.fileName,
              executionTime: 'Execution Time not found',
            };
          });
          setExecutionTimes(times);
        } else {
          setExecutionTimes([]);
        }
      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const extractExecutionTime = xsdXml => {
    const matches = xsdXml.match(
      /<activiti:formProperty id="[^"]+" name="([^"]+)" expression="(\d+)\/(\d+)"/,
    );
    if (matches && matches.length === 4) {
      const name = matches[1];
      const minDays = parseInt(matches[2]);
      const maxDays = parseInt(matches[3]);

      if (name === 'w') {
        return `${minDays} - ${maxDays} рабочих дней`;
      } else if (name === 'c') {
        return `${minDays} - ${maxDays} календарных дней`;
      }
    }
    return 'Отсутствует';
  };

  return { executionTimes, error };
};

export default useExecutionTime;
