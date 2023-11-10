import React, { useState } from 'react';

const ProcessInfo = ({ tasks, selectedTask, setSelectedTask, exportTasks, formPropertyIds, processId, callActivityVariableIds, taskVariableIds, additionalIdExtractor }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedTasks = tasks.slice().sort((a, b) => a.name.localeCompare(b.name));

  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === 'all') return true;
    return task.type === filter || filter === 'all';
  });

  const searchedTasks = filteredTasks.filter((task) => {
    return task.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSelectedTask = () => {
    console.log('additionalIdExtractor(selectedTask):', additionalIdExtractor(selectedTask));
    setSelectedTask(null);
  };
  
  console.log('formPropertyIds:', formPropertyIds);
  console.log('selectedTask:', selectedTask);

  return (
    <div className="process-info">
      <h2>Информация о этапах BPMN:</h2>
      <div className="filters">
        <label>
          Фильтр:
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">Все</option>
            <option value="bpmn:UserTask">User Tasks</option>
            <option value="bpmn:ServiceTask">Service Tasks</option>
            <option value="bpmn:StartEvent">Start Events</option>
            <option value="bpmn:CallActivity">call Activity</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Поиск этапов"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="task-buttons">
          {searchedTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`task-button ${task.type === 'bpmn:UserTask' ? 'user-task' : task.type === 'bpmn:ServiceTask' ? 'service-task' : task.type === 'bpmn:CallActivity' ? 'call-activity' : 'start-event'}`}
            >
              {task.type === 'bpmn:UserTask' ? (
                <span role="img" aria-label="User Task">👨🏼‍💼</span>
              ) : task.type === 'bpmn:ServiceTask' ? (
                <span role="img" aria-label="Service Task">⚙️</span>
              ) : task.type === 'bpmn:CallActivity' ? (
                <span role="img" aria-label="Call Activity">🧠</span>
              ) : (
                <span role="img" aria-label="Start Event">⭐</span>
              )}
              {task.name}
            </button>
          ))}
        </div>
      <button onClick={exportTasks}>Экспорт этапов</button>

      {selectedTask && (
        <div className="task-details">
          <h3>Детали этапа:</h3>
          <p>Имя: {selectedTask.name}</p>
          <p>Тип: {selectedTask.type}</p>
          <p>ID: {selectedTask.additionalId}</p>
          <p>Process ID: {selectedTask.processId}</p>
          {selectedTask.type === 'bpmn:CallActivity' && (
          <div className="call-activity-ids">
            <h4>CallActivity:</h4>
            {Object.entries(callActivityVariableIds).map(([callActivityId, variableIds]) => (
              <div key={callActivityId}>
                <p>CallActivity ID: {callActivityId}</p>
                <p>Cписок полей отправленых в межвед: {variableIds.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
        {/* <div className="task-variable-ids">
            <h4>Fields:</h4>
            {Object.entries(taskVariableIds).map(([taskId, variableIds]) => (
              <div key={taskId}>
                <p>Task ID: {taskId}</p>
                <p>List of variables: {variableIds.join(', ')}</p>
              </div>
            ))}
          </div> */}
            <div>
              <h3>Fields приходящие:</h3>
              {searchedTasks.map((task) => (
                <div key={task.id}>
                  <p>{`Task ID: ${task.id}`}</p>
                  <ul>
                  {formPropertyIds
                  .filter((formProperty) => additionalIdExtractor(task) === formProperty.id)
                  .map((formProperty) => (
                    <li key={formProperty.id}>
                      {`Form Property ID for ${task.name}: ${formProperty.id}, Name: ${formProperty.name}`}
                    </li>
                  ))}
                  </ul>
                </div>
              ))}
            </div>
          <button onClick={clearSelectedTask}>Закрыть</button>
        </div>
      )}
    </div>
  );
};

export default ProcessInfo;