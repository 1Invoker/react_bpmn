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
  const [button1Active, setButton1Active] = useState(false);

  const handleButtonClick = (buttonNumber) => {
    if (buttonNumber === 1) {
      setButton1Active(!button1Active);
    }
  };

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

  const mapSourceToFieldName = (source) => {
    const sourceMappings = {
      'executorkey_OKTMO': 'ОКТМО исполнителя',
      'declarantType': 'Тип заявителя',
      'organizationOPF': 'ОПФ организации',
      'organizationINN': 'ИНН организации',
      'organizationOGRN': 'ОГРН организации',
      'organizationEmail': 'Email организации',
      'organizationPhone': 'Телефон организации',
      'declPersonFIOSurname': 'Фамилия заявителя',
      'declPersonFIOFirst': 'Имя заявителя',
      'declPersonFIOPatronymic': 'Отчество заявителя',
      'declPersonEmail': 'Email заявителя',
      'declPersonPhone': 'Телефон заявителя',
      'declPersonSNILS': 'СНИЛС заявителя',
      'doc_applicantIdentity_type2': 'Код документа заявителя',
      'declPersonPDocumentSeries': 'Серия документа заявителя',
      'declPersonPDocumentNumber': 'Номер документа заявителя',
      'declPersonPDocumentDate': 'Дата выдачи документа заявителя',
      'declPersonPDocumentIssueOrgan': 'Орган, выдавший документ заявителя',
      'flagRepresentative': 'Является представителем',
      'agentFIOSurname': 'Фамилия представителя',
      'agentFIOFirst': 'Имя представителя',
      'agentFIOPatronymic': 'Отчество представителя',
      'agentPDocumentSeries': 'Серия документа представителя',
      'agentPDocumentNumber': 'Номер документа представителя',
      'agentPDocumentDate': 'Дата выдачи документа представителя',
      'agentPDocumentIssueOrgan': 'Орган, выдавший документ представителя',
      'agentPhone': 'Телефон представителя',
      'agentEmail': 'Email представителя',
      'agentSNILS': 'СНИЛС представителя',
      'agentKind': 'Вид представителя',
    };
  
    return sourceMappings[source] || source;
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
            <div class="button-container">
            <button
                onClick={() => handleButtonClick(1)}
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: button1Active ? '#28a745' : '#dc3545', 
                  color: '#fff',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
                  transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
                  position: 'relative',
                }}
              >
                Актив
                {button1Active && (
                  <span
                    className="lamp"
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      marginLeft: '5px',
                      backgroundColor: '#fff',
                      boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)', // Зеленая лампочка при активации
                      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                )}
              </button>
              <button onClick={exportTasks} className="button2">Посмотреть МВ</button>
            </div>
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
                                  <TableCell>Наименование поля</TableCell>
                                  <TableCell>Источник(ID поля)</TableCell>
                                  <TableCell>Межвед(ID поля МВ)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {variableData.inVariables.map((variable) => {
                                  let fieldName;
                                  switch (variable.source) {
                                    case 'executorkey_OKTMO':
                                      fieldName = 'ОКТМО исполнителя';
                                      break;
                                    case 'declarantType':
                                      fieldName = 'Тип заявителя';
                                      break;
                                    case 'organizationOPF':
                                      fieldName = 'ОПФ организации';
                                      break;
                                    case 'organizationINN':
                                      fieldName = 'ИНН организации';
                                      break;
                                    case 'organizationOGRN':
                                      fieldName = 'ОГРН организации';
                                      break;
                                    case 'organizationEmail':
                                      fieldName = 'Email организации';
                                      break;
                                    case 'organizationPhone':
                                      fieldName = 'Телефон организации';
                                      break;
                                    case 'declPersonFIOSurname':
                                      fieldName = 'Фамилия заявителя';
                                      break;
                                    case 'declPersonFIOFirst':
                                      fieldName = 'Имя заявителя';
                                      break;
                                    case 'declPersonFIOPatronymic':
                                      fieldName = 'Отчество заявителя';
                                      break;
                                    case 'declPersonEmail':
                                      fieldName = 'Email заявителя';
                                      break;
                                    case 'declPersonPhone':
                                      fieldName = 'Телефон заявителя';
                                      break;
                                    case 'declPersonSNILS':
                                      fieldName = 'СНИЛС заявителя';
                                      break;
                                    case 'doc_applicantIdentity_type2':
                                      fieldName = 'Код документа заявителя';
                                      break;
                                    case 'declPersonPDocumentSeries':
                                      fieldName = 'Серия документа заявителя';
                                      break;
                                    case 'declPersonPDocumentNumber':
                                      fieldName = 'Номер документа заявителя';
                                      break;
                                    case 'declPersonPDocumentDate':
                                      fieldName = 'Дата выдачи документа заявителя';
                                      break;
                                    case 'declPersonPDocumentIssueOrgan':
                                      fieldName = 'Орган, выдавший документ заявителя';
                                      break;
                                    case 'flagRepresentative':
                                      fieldName = 'Является представителем';
                                      break;
                                    case 'agentFIOSurname':
                                      fieldName = 'Фамилия представителя';
                                      break;
                                    case 'agentFIOFirst':
                                      fieldName = 'Имя представителя';
                                      break;
                                    case 'agentFIOPatronymic':
                                      fieldName = 'Отчество представителя';
                                      break;
                                    case 'agentPDocumentSeries':
                                      fieldName = 'Серия документа представителя';
                                      break;
                                    case 'agentPDocumentNumber':
                                      fieldName = 'Номер документа представителя';
                                      break;
                                    case 'agentPDocumentDate':
                                      fieldName = 'Дата выдачи документа представителя';
                                      break;
                                    case 'agentPDocumentIssueOrgan':
                                      fieldName = 'Орган, выдавший документ представителя';
                                      break;
                                    case 'agentPhone':
                                      fieldName = 'Телефон представителя';
                                      break;
                                    case 'agentEmail':
                                      fieldName = 'Email представителя';
                                      break;
                                    case 'agentSNILS':
                                      fieldName = 'СНИЛС представителя';
                                      break;
                                    case 'agentKind':
                                      fieldName = 'Вид представителя';
                                      break;
                                    case 'LP_data_INN':
                                      fieldName = 'ИНН Юридического лица';
                                      break;
                                    case 'LP_data_OGRN':
                                      fieldName = 'ОГРН Юридического лица';
                                      break;
                                      case 'rq_paymentsExportConditions':
                                      fieldName = 'Условия экспорта платежей';
                                      break;
                                    case 'payerType':
                                      fieldName = 'Тип плательщика';
                                      break;
                                    case 'INN':
                                      fieldName = 'ИНН';
                                      break;
                                      case 'phone':
                                      fieldName = 'Телефон';
                                      break;
                                    default:
                                      fieldName = mapSourceToFieldName(variable.additionalField);
                                      break;
                                  }
                                  return (
                                    <TableRow key={`${variable.source}-${variable.target}`}>
                                      <TableCell>{fieldName}</TableCell>
                                      <TableCell>{variable.source}</TableCell>
                                      <TableCell>{variable.target}</TableCell>
                                    </TableRow>
                                  );
                                })}
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
