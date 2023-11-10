import React, { useCallback, useEffect, useState } from 'react';
import ProcessInfo from './ProcessInfo';

const FieldsExtractor = ({ processXml }) => {
  const [taskData, setTaskData] = useState([]);

  const extractTaskData = useCallback(() => {
    const taskTypes = ['bpmn:userTask', 'bpmn:serviceTask'];
    const extractedData = [];

    taskTypes.forEach((taskType) => {
      const regex = new RegExp(`<${taskType} id="([^"]+)".*<extensionElements>(.*?)</extensionElements>`, 'gs');
      let match;
      while ((match = regex.exec(processXml)) !== null) {
        const taskId = match[1];
        const variableRegex = /<activiti:formProperty id="([^"]+)"/g;
        let variableMatch;
        const variables = [];
        while ((variableMatch = variableRegex.exec(match[2])) !== null) {
          variables.push(variableMatch[1]);
        }
        extractedData.push({ taskIdentifier: taskId, fieldIds: variables });
      }
    });

    console.log('Extracted Task Data:', extractedData); // Отладочный вывод

    setTaskData(extractedData);
  }, [processXml]);

  useEffect(() => {
    console.log('Process XML:', processXml); // Отладочный вывод
    extractTaskData();
  }, [extractTaskData, processXml]);

  return (
    <div>
      <h4>Fields:</h4>
      {taskData.map(({ taskIdentifier, fieldIds }) => (
        <div key={taskIdentifier}>
          <p>Task ID: {taskIdentifier}</p>
          <p>Field IDs: {fieldIds.join(', ')}</p>
          {/* <ProcessInfo customTaskId={taskIdentifier} customFieldIds={fieldIds} /> */}
        </div>
      ))}
    </div>
  );
};

export default FieldsExtractor;
