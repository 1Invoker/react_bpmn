import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './ProcessInfo.css';

const ProcessInfo = ({ tasks, selectedTask, setSelectedTask, exportTasks, processId, callActivityVariableIds, taskVariableIds, startEventFormProperties }) => {
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
    setSelectedTask(null);
  };

  return (
    <div className="process-info">
      <div className="info-column">
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
        <div className="task-table">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Тип</TableCell>
                  <TableCell>Название этапа</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedTasks.map((task) => (
                  <TableRow key={task.id} onClick={() => setSelectedTask(task)}>
                    <TableCell>
                      {task.type === 'bpmn:UserTask' ? (
                        <span role="img" aria-label="User Task">👨🏼‍💼</span>
                      ) : task.type === 'bpmn:ServiceTask' ? (
                        <span role="img" aria-label="Service Task">⚙️</span>
                      ) : task.type === 'bpmn:CallActivity' ? (
                        <span role="img" aria-label="Call Activity">🧠</span>
                      ) : (
                        <span role="img" aria-label="Start Event">⭐</span>
                      )}
                    </TableCell>
                    <TableCell>{task.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <button onClick={exportTasks} className="export-button">Экспорт этапов</button>
      </div>


      {selectedTask && (
        <div className="details-column">
          <div className="task-details">
            <h3>Детали этапа:</h3>
            <p>Имя: {selectedTask.name}</p>
            <p>Тип: {selectedTask.type}</p>
            <p>ID: {selectedTask.additionalId}</p>
            <p>Process ID: {selectedTask.processId}</p>
            {selectedTask.type === 'bpmn:CallActivity' && (
              <div className="call-activity-ids">
                <h4>Межведы:</h4>
                {Object.entries(callActivityVariableIds).map(([callActivityId, variableData]) => (
                  <div key={callActivityId}>
                    <p>CallActivity ID: {callActivityId}</p>
                    <div>
                      <p>Поля отправленные в межвед (activiti:in):</p>
                      {variableData.inVariables && variableData.inVariables.length > 0 ? (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Источник</TableCell>
                                  <TableCell>Межвед</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {variableData.inVariables.map((variable) => (
                                  <TableRow key={`${variable.source}-${variable.target}`}>
                                    <TableCell>{variable.source}</TableCell>
                                    <TableCell>{variable.target}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      ) : (
                        <p>Нет данных</p>
                      )}
                    </div>
                    <div>
                      <p>Поля исходящие из межведа (activiti:out):</p>
                      {variableData.outVariables && variableData.outVariables.length > 0 ? (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Межвед</TableCell>
                                  <TableCell>Текущий маршрут</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {variableData.outVariables.map((variable) => (
                                  <TableRow key={`${variable.source}-${variable.target}`}>
                                    <TableCell>{variable.source}</TableCell>
                                    <TableCell>{variable.target}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      ) : (
                        <p>Нет данных</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {startEventFormProperties.length > 0 && (
              <div className="start-event-form-properties">
                <h4>Поля:</h4>
                {startEventFormProperties && startEventFormProperties.length > 0 ? (
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {startEventFormProperties.map((formProperty) => (
                            <TableRow key={formProperty.id}>
                              <TableCell>{formProperty.id}</TableCell>
                              <TableCell>{formProperty.name}</TableCell>
                              <TableCell>{formProperty.type}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                ) : (
                  <p>Нет данных</p>
                )}
              </div>
            )}

            <button onClick={clearSelectedTask}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessInfo;
