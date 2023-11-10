import React, { useState, useEffect } from 'react';
import BpmnViewer from 'bpmn-js';

const BpmnFileReader = () => {
  const [xml, setXml] = useState(null);
  const [tasks, setTasks] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setXml(reader.result);
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (xml) {
      const viewer = new BpmnViewer({
        container: '#bpmn-container',
      });

      viewer.importXML(xml, (err) => {
        if (!err) {
          const elementRegistry = viewer.get('elementRegistry');
          const bpmnElements = elementRegistry.filter(
            (element) => element.type === 'bpmn:UserTask' || element.type === 'bpmn:ServiceTask'
          );

          const taskData = bpmnElements.map((element) => {
            const businessObject = element.businessObject;
            const extensionElements = businessObject.extensionElements;
            const formProperties =
              extensionElements?.values?.filter((value) => value.$type === 'activiti:FormProperty') || [];

            return {
              id: element.id,
              name: businessObject.name,
              type: element.type,
              additionalId: businessObject.id,
              processId: businessObject.$parent.id,
              formProperties: formProperties,
            };
          });

          setTasks(taskData);
        } else {
          console.error('Ошибка отображения диаграммы BPMN', err);
        }
      });
    }
  }, [xml]);

  return (
    <div>
      <input type="file" accept=".bpmn" onChange={handleFileChange} />
      <div id="bpmn-container" style={bpmnContainerStyles}></div>
      <div>
        <h2>Список задач:</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.type}: {task.name} (Form Property ID: {task.additionalId})
              {task.formProperties && task.formProperties.length > 0 && (
                <ul>
                  {task.formProperties.map((formProperty) => (
                    <li key={formProperty.id}>
                      Form Property ID: {formProperty.id}, Name: {formProperty.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const bpmnContainerStyles = {
  height: '400px',
  border: '1px solid #cccccc',
  margin: '20px 0',
};

export default BpmnFileReader;
