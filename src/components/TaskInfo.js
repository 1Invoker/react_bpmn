import React, { useState, useEffect } from 'react';

const TaskInfo = ({ xml, taskData, taskType }) => {
  const [taskVariableIds, setTaskVariableIds] = useState({});

  useEffect(() => {
    const fetchTaskData = () => {
      const taskIds = taskData
        .filter((task) => task.type === taskType)
        .map((task) => task.id);

      const taskDataMap = {};
      taskIds.forEach((taskId) => {
        const regex = new RegExp(
          `<${taskType} id="${taskId}".*<extensionElements>(.*?)</extensionElements>`,
          'gs'
        );
        let match;
        while ((match = regex.exec(xml)) !== null) {
          const variableRegex = /<activiti:formProperty id="([^"]+)"/g;
          let variableMatch;
          const variables = [];
          while ((variableMatch = variableRegex.exec(match[1])) !== null) {
            variables.push(variableMatch[1]);
          }
          taskDataMap[taskId] = variables;
        }
      });

      setTaskVariableIds(taskDataMap);
    };

    fetchTaskData();
  }, [xml, taskData, taskType]);

  return (
    <div className="task-info">
      <h4>{taskType === 'bpmn:UserTask' ? 'UserTask' : 'ServiceTask'}:</h4>
      {Object.entries(taskVariableIds).map(([taskId, variableIds]) => (
        <div key={taskId}>
          <p>{`${taskType} ID: ${taskId}`}</p>
          <p>{`Список полей: ${variableIds.join(', ')}`}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskInfo;
