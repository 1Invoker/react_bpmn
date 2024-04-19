import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ProcessInfo from '../ProcessInfo/ProcessInfo';
import './BpmnDiagram.css';

const BpmnDiagram = ({ xml, onCalledElementChange }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [smevVersion, setSmevVersion] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [processName, setProcessName] = useState(null);
  const [processId, setProcessId] = useState(null);
  const [callActivityVariableIds, setCallActivityVariableIds] = useState({});
  const [startEventFormProperties, setStartEventFormProperties] = useState([]);
  const [calledElements, setCalledElements] = useState([]);

  useEffect(() => {
    viewerRef.current = new BpmnViewer({
      container: containerRef.current,
    });

    viewerRef.current.importXML(xml, err => {
      if (!err) {
        const canvas = viewerRef.current.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
        setCurrentScale(canvas.zoom());

        const elementRegistry = viewerRef.current.get('elementRegistry');
        const bpmnElements = elementRegistry.filter(element => {
          return (
            element.type === 'bpmn:UserTask' ||
            element.type === 'bpmn:ServiceTask' ||
            element.type === 'bpmn:formProperty' ||
            element.type === 'bpmn:StartEvent' ||
            element.type === 'bpmn:CallActivity'
          );
        });

        const taskData = bpmnElements.map(element => {
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

        const callActivityIds = taskData
          .filter(task => task.type === 'bpmn:CallActivity')
          .map(callActivity => callActivity.id);

        const CallActivityVariableIds = {};
        callActivityIds.forEach(callActivityId => {
          const regex = new RegExp(
            `<callActivity id="${callActivityId}".*<extensionElements>(.*?)</extensionElements>`,
            'gs',
          );
          let match;
          while ((match = regex.exec(xml)) !== null) {
            const extensionElementsData = match[1];

            const inVariableRegex =
              /<activiti:in\s+source="([^"]+)"\s+target="([^"]+)"/g;
            let inVariableMatch;
            const inVariables = [];
            while (
              (inVariableMatch = inVariableRegex.exec(
                extensionElementsData,
              )) !== null
            ) {
              const source = inVariableMatch[1];
              const target = inVariableMatch[2];
              inVariables.push({ source, target, type: 'in' });
            }

            const outVariableRegex =
              /<activiti:out\s+source="([^"]+)"\s+target="([^"]+)"/g;
            let outVariableMatch;
            const outVariables = [];
            while (
              (outVariableMatch = outVariableRegex.exec(
                extensionElementsData,
              )) !== null
            ) {
              const source = outVariableMatch[1];
              const target = outVariableMatch[2];
              outVariables.push({ source, target, type: 'out' });
            }

            CallActivityVariableIds[callActivityId] = {
              inVariables,
              outVariables,
            };

            //  вывод в консоль данных между extensionElements и activiti:in
            console.log(
              `Extension Elements Data for callActivity ${callActivityId}: ${extensionElementsData}`,
            );
          }
        });

        //  код для поиска callActivity с конкретными атрибутами
        const specificCallActivityRegex =
          /<callActivity\s+id="([^"]+)"\s+name="([^"]+)"\s+calledElement="([^"]+)">.*?<\/callActivity>/gs;
        let specificCallActivityMatch;
        const calledElements = [];
        while (
          (specificCallActivityMatch = specificCallActivityRegex.exec(xml)) !==
          null
        ) {
          const specificCallActivityId = specificCallActivityMatch[1];
          const specificCallActivityName = specificCallActivityMatch[2];
          const specificCallActivityCalledElement =
            specificCallActivityMatch[3];

          console.log(
            `Found specific callActivity with id: ${specificCallActivityId}, name: ${specificCallActivityName}, calledElement: ${specificCallActivityCalledElement}`,
          );

          calledElements.push(specificCallActivityCalledElement);
          if (typeof onCalledElementChange === 'function') {
            onCalledElementChange(specificCallActivityCalledElement);
          }
        }

        setCallActivityVariableIds(CallActivityVariableIds);
        setStartEventFormProperties(extractFormPropertiesFromStartEvent(xml));
        setCalledElements(calledElements);

        const startEventFormProperties =
          extractFormPropertiesFromStartEvent(xml);
        setStartEventFormProperties(startEventFormProperties);

        let isDragging = false;
        let startX, startY;

        if (containerRef.current) {
          containerRef.current.addEventListener('mousedown', e => {
            isDragging = true;
            startX =
              e.clientX - containerRef.current.getBoundingClientRect().left;
            startY =
              e.clientY - containerRef.current.getBoundingClientRect().top;
          });

          containerRef.current.addEventListener('mousemove', e => {
            if (isDragging) {
              const newX =
                e.clientX - containerRef.current.getBoundingClientRect().left;
              const newY =
                e.clientY - containerRef.current.getBoundingClientRect().top;
              const deltaX = newX - startX;
              const deltaY = newY - startY;
              viewerRef.current
                .get('canvas')
                .scroll({ dx: deltaX, dy: deltaY });
              startX = newX;
              startY = newY;
            }
          });

          containerRef.current.addEventListener('mouseup', () => {
            isDragging = false;
          });

          containerRef.current.addEventListener('mouseleave', () => {
            isDragging = false;

            containerRef.current.addEventListener('wheel', e => {
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

  const extractSmevVersion = xml => {
    const matches = xml.match(/#\{(smev\d+)\./);
    if (matches && matches[1]) {
      setSmevVersion(matches[1]);
    } else {
      setSmevVersion('smev2');
    }
  };

  const extractExecutionTime = xml => {
    const matches = xml.match(
      /<activiti:formProperty id="[^"]+" name="([^"]+)" expression="(\d+)\/(\d+)"/,
    );
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

  const extractProcessName = xml => {
    const matches = xml.match(/<process id="[^"]+" name="([^"]+)"/);
    if (matches && matches[1]) {
      setProcessName(matches[1]);
    } else {
      setProcessName('Process Name not found');
    }
  };

  const extractProcessId = xml => {
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

  const extractFormPropertiesFromStartEvent = xml => {
    const startEventRegex =
      /<startEvent id="[^"]+" name="[^"]+">(.*?)<\/startEvent>/gs;
    const match = startEventRegex.exec(xml);
    const formProperties = [];

    if (match) {
      const startEventContent = match[1];
      const formPropertyRegex =
        /<activiti:formProperty id="([^"]+)" name="([^"]+)" type="([^"]+)"/g;
      let formPropertyMatch;

      while (
        (formPropertyMatch = formPropertyRegex.exec(startEventContent)) !== null
      ) {
        const id = formPropertyMatch[1];
        const name = formPropertyMatch[2];
        const type = formPropertyMatch[3];
        formProperties.push({ id, name, type });
      }
    }

    return formProperties;
  };

  return (
    <div className="bpmn-container" style={{ userSelect: 'none' }}>
      <div
        className="bpmn-diagram-container"
        ref={containerRef}
        onWheel={e => {
          const delta = e.deltaY;
          if (delta > 0) {
            zoomOut();
          } else {
            zoomIn();
          }
        }}
        style={{ cursor: 'grab' }}
      >
        <div className="zoom-buttons">
          <IconButton
            onClick={zoomIn}
            color="primary"
            aria-label="Zoom In"
            sx={{
              color: 'black',
            }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={zoomOut}
            color="primary"
            aria-label="Zoom Out"
            sx={{
              color: 'black',
            }}
          >
            <ZoomOutIcon />
          </IconButton>
        </div>
      </div>
      {/* <div className="info-container">
        <div className="smev-version">
          {smevVersion
            ? `Версия SMEV: ${smevVersion}`
            : 'SMEV Version not found'}
        </div>
        <div className="process-name">
          {processName
            ? `Process Name: ${processName}`
            : 'Process Name not found'}
        </div>
        <div className="execution-time">
          {executionTime
            ? `Время исполнения: ${executionTime}`
            : 'Время исполнения not found'}
        </div>
        <div className="execution-ID">
          {processId ? `Process ID: ${processId}` : 'Process ID not found'}
        </div>
      </div> */}
      <ProcessInfo
        tasks={tasks}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        processId={processId}
        callActivityVariableIds={callActivityVariableIds}
        additionalIdExtractor={task => task.businessObject.additionalId}
        startEventFormProperties={startEventFormProperties}
      />
    </div>
  );
};

export default BpmnDiagram;
