import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ProcessInfo from './ProcessInfo';
import FieldsExtractor from './FieldsExtractor';

const BpmnDiagram = ({ xml }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [smevVersion, setSmevVersion] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [processName, setProcessName] = useState(null);
  const [processId, setProcessId] = useState(null);
  const [formPropertyIds, setFormPropertyIds] = useState([]);
  const [callActivityVariableIds, setCallActivityVariableIds] = useState({});
  const [taskVariableIds, settaskVariableIds] = useState({});

  useEffect(() => {
    viewerRef.current = new BpmnViewer({
      container: containerRef.current,
    });

    viewerRef.current.importXML(xml, (err) => {
      if (!err) {
        const canvas = viewerRef.current.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
        setCurrentScale(canvas.zoom());

        const elementRegistry = viewerRef.current.get('elementRegistry');
        const bpmnElements = elementRegistry.filter((element) => {
          return (
            element.type === 'bpmn:UserTask' ||
            element.type === 'bpmn:ServiceTask' ||
            element.type === 'bpmn:formProperty' ||
            element.type === 'bpmn:StartEvent' ||
            element.type === 'bpmn:CallActivity'
          );
        });

        const taskData = bpmnElements.map((element) => {
          const businessObject = element.businessObject;
          return {
            id: element.id,
            name: businessObject.name,
            type: element.type,
            additionalId: businessObject.id,
            processId: businessObject.$parent.id,
          };
        });

        setTasks(taskData);

        extractSmevVersion(xml);
        extractExecutionTime(xml);
        extractProcessName(xml);
        extractProcessId(xml);

        const formProperties = tasks
        .filter((task) => task.type === 'bpmn:formProperty')
        .map((task) => task.id);

      const formPropertyData = [];
      formProperties.forEach((taskId) => {
        const regex = new RegExp(`<activiti:formProperty id="([^"]+)" name="([^"]+)"`, 'g');
        let match;
        while ((match = regex.exec(xml)) !== null) {
          formPropertyData.push({ id: match[1], name: match[2] });
        }
      });

      setFormPropertyIds(formPropertyData);


     
        // const taskTypes = ['bpmn:userTask', 'bpmn:serviceTask'];
        // taskTypes.forEach((taskType) => {
        //   const taskIds = tasks
        //     .filter((task) => task.type === taskType)
        //     .map((task) => task.id);

        //   taskIds.forEach((taskId) => {
        //     const regex = new RegExp(`<${taskType} id="${taskId}".*<extensionElements>(.*?)</extensionElements>`, 'gs');
        //     let match;
        //     while ((match = regex.exec(xml)) !== null) {
        //       const variableRegex = /<activiti:formProperty id="([^"]+)"/g;
        //       let variableMatch;
        //       const variables = [];
        //       while ((variableMatch = variableRegex.exec(match[1])) !== null) {
        //         variables.push(variableMatch[1]);
        //       }
        //       taskVariableIds[taskId] = variables;
        //     }
        //   });
        // });
        // settaskVariableIds(taskVariableIds);

        

       const callActivityIds = tasks
        .filter((task) => task.type === 'bpmn:CallActivity')
        .map((callActivity) => callActivity.id);

      const CallActivityVariableIds = {};
      callActivityIds.forEach((callActivityId) => {
        const regex = new RegExp(`<callActivity id="${callActivityId}".*<extensionElements>(.*?)</extensionElements>`, 'gs');
        let match;
        while ((match = regex.exec(xml)) !== null) {
          const variableRegex = /<activiti:in source="([^"]+)"/g;
          let variableMatch;
          const variables = [];
          while ((variableMatch = variableRegex.exec(match[1])) !== null) {
            variables.push(variableMatch[1]);
          }
          CallActivityVariableIds[callActivityId] = variables;
        }
      });

      setCallActivityVariableIds(CallActivityVariableIds);


        let isDragging = false;
        let startX, startY;

        if (containerRef.current) {
          containerRef.current.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - containerRef.current.getBoundingClientRect().left;
            startY = e.clientY - containerRef.current.getBoundingClientRect().top;
          });

          containerRef.current.addEventListener('mousemove', (e) => {
            if (isDragging) {
              const newX = e.clientX - containerRef.current.getBoundingClientRect().left;
              const newY = e.clientY - containerRef.current.getBoundingClientRect().top;
              const deltaX = newX - startX;
              const deltaY = newY - startY;
              viewerRef.current.get('canvas').scroll({ dx: deltaX, dy: deltaY });
              startX = newX;
              startY = newY;
            }
          });

          containerRef.current.addEventListener('mouseup', () => {
            isDragging = false;
          });

          containerRef.current.addEventListener('mouseleave', () => {
            isDragging = false;
          
            containerRef.current.addEventListener('wheel', (e) => {
              e.preventDefault();
            });
  
          });
        }
      } else {
        console.error('Error displaying BPMN diagram', err);
      }
    });

    return () => viewerRef.current.destroy();
  }, [xml]);

  const extractSmevVersion = (xml) => {
    const matches = xml.match(/#\{(smev\d+)\./);
    if (matches && matches[1]) {
      setSmevVersion(matches[1]);
    } else {
      setSmevVersion('smev2');
    }
  };

  const extractExecutionTime = (xml) => {
    const matches = xml.match(/<activiti:formProperty id="[^"]+" name="[^"]+" expression="(\d+)\/(\d+)"/);
    if (matches && matches.length === 3) {
      const minDays = parseInt(matches[1]);
      const maxDays = parseInt(matches[2]);
      setExecutionTime(`Execution Time: ${minDays} - ${maxDays} days`);
    } else {
      setExecutionTime('Execution Time not found');
    }
  };

  const extractProcessName = (xml) => {
    const matches = xml.match(/<process id="[^"]+" name="([^"]+)"/);
    if (matches && matches[1]) {
      setProcessName(matches[1]);
    } else {
      setProcessName('Process Name not found');
    }
  };

  const extractProcessId = (xml) => {
    const matches = xml.match(/<process id="([^"]+)"/);
    if (matches && matches[1]) {
      setProcessId(matches[1]);
    } else {
      setProcessId('Process ID not found');
    }
  };

  const zoomIn = () => {
    const newScale = currentScale * 1.1;
    viewerRef.current.get('canvas').zoom(newScale);
    setCurrentScale(newScale);
  };

  const zoomOut = () => {
    const newScale = currentScale * 0.9;
    viewerRef.current.get('canvas').zoom(newScale);
    setCurrentScale(newScale);
  };

  return (
    <div className="bpmn-container" style={{ userSelect: 'none' }}>
    <div className="bpmn-diagram-container" ref={containerRef} onWheel={(e) => {
      e.preventDefault(); 
      const delta = e.deltaY;
      if (delta > 0) {
        zoomOut();
      } else {
        zoomIn();
      }
    }} style={{ cursor: 'grab' }}>
  
        <div className="zoom-buttons">
          <IconButton onClick={zoomIn} color="primary" aria-label="Zoom In">
            <ZoomInIcon />
          </IconButton>
          <IconButton onClick={zoomOut} color="primary" aria-label="Zoom Out">
            <ZoomOutIcon />
          </IconButton>
        </div>
      </div>
      <div className="info-container">
        <div className="smev-version">
          {smevVersion ? `SMEV Version: ${smevVersion}` : 'SMEV Version not found'}
        </div>
        <div className="process-name">
          {processName ? `Process Name: ${processName}` : 'Process Name not found'}
        </div>
        <div className="execution-time">
          {executionTime ? `Время исполнения: ${executionTime}` : 'Время исполнения not found'}
        </div>
        <div className="execution-time">
          {processId ? `Process ID: ${processId}` : 'Process ID not found'}
        </div>
        <div className="call-activity-ids">
          <h4>CallActivity:</h4>
          {Object.entries(callActivityVariableIds).map(([callActivityId, variableIds]) => (
            <div key={callActivityId}>
              <p>CallActivity ID: {callActivityId}</p>
              <p>Cписок полей отправленых в межвед: {variableIds.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
      <FieldsExtractor processXml={xml} />
      <ProcessInfo tasks={tasks} selectedTask={selectedTask} setSelectedTask={setSelectedTask} formPropertyIds={formPropertyIds} processId={processId} callActivityVariableIds={callActivityVariableIds} taskVariableIds={taskVariableIds }  additionalIdExtractor={(task) => task.businessObject.additionalId} />
    </div>
  );
};

export default BpmnDiagram;
