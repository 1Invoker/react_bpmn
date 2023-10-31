import React from 'react';

const ProcessInfo = ({ tasks }) => {
  return (
    <div className="process-info">
      <h2>Информация о этапах BPMN:</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessInfo;
