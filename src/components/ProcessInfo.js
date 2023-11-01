import React, { useState } from 'react';

const ProcessInfo = ({ tasks }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null); // Добавляем состояние для выбранного задания

  const sortedTasks = tasks.slice().sort((a, b) => a.name.localeCompare(b.name));

  // Фильтрация задач
  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === 'all') return true;
    return task.type === filter || filter === 'all';
  });

  // Поиск задач
  const searchedTasks = filteredTasks.filter((task) => {
    return task.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Функция для обработки клика на задачу
  const handleTaskClick = (task) => {
    setSelectedTask(task); // Устанавливаем выбранный этап
  };

  // Функция для сброса выбранного этапа
  const clearSelectedTask = () => {
    setSelectedTask(null);
  };

  // Функция для экспорта задач (просто пример)
  const exportTasks = () => {
    console.log('Экспорт задач');
  };

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
          </select>
        </label>
        <input
          type="text"
          placeholder="Поиск задач"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <ul>
        {searchedTasks.map((task) => (
          <li key={task.id} onClick={() => handleTaskClick(task)}>
            {task.name}
          </li>
        ))}
      </ul>
      <button onClick={exportTasks}>Экспорт задач</button>

      {selectedTask && (
        <div className="task-details">
          <h3>Детали задачи:</h3>
          <p>Имя: {selectedTask.name}</p>
          <p>Тип: {selectedTask.type}</p>
          <button onClick={clearSelectedTask}>Закрыть</button>
        </div>
      )}
    </div>
  );
};

export default ProcessInfo;