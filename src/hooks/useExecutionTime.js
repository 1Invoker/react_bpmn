import { useState, useEffect } from 'react';

const useExecutionTime = xsdXml => {
  const [executionTime, setExecutionTime] = useState(null);

  const extractExecutionTime = xsdXml => {
    const matches = xsdXml.match(
      /<activiti:formProperty id="[^"]+" name="([^"]+)" expression="(\d+)\/(\d+)"/,
    );
    console.log(xsdXml);
    if (matches && matches.length === 4) {
      const name = matches[1];
      const minDays = parseInt(matches[2]);
      const maxDays = parseInt(matches[3]);

      if (name === 'w') {
        setExecutionTime(`${minDays} - ${maxDays} рабочих дней`);
      } else if (name === 'c') {
        setExecutionTime(
          `Execution Time: ${minDays} - ${maxDays} календарных дней`,
        );
      } else {
        setExecutionTime('Execution Time not found');
      }
    } else {
      setExecutionTime('Execution Time not found');
    }
  };

  useEffect(() => {
    extractExecutionTime(xsdXml);
  }, [xsdXml]);

  return executionTime;
};

export default useExecutionTime;
