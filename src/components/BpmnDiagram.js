import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ProcessInfo from './ProcessInfo';

const BpmnDiagram = ({ xml }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    viewerRef.current = new BpmnViewer({ container: containerRef.current });

    viewerRef.current.importXML(xml)
      .then(() => {
        console.log('BPMN-диаграмма успешно загружена');
        setCurrentScale(viewerRef.current.get('canvas').zoom());

        const elements = viewerRef.current.get('elementRegistry').filter((element) => {
          return element.type === 'bpmn:UserTask' || element.type === 'bpmn:ServiceTask';
        });

        const taskData = elements.map((element) => {
          return {
            id: element.id,
            name: element.businessObject.name,
            type: element.type,
          };
        });

        setTasks(taskData);
      })
      .catch((err) => {
        console.error('Ошибка при отображении BPMN-диаграммы', err);
      });

    return () => viewerRef.current.destroy();
  }, [xml]);

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
    <div className="bpmn-container">
      <div className="bpmn-diagram-container" ref={containerRef}>
        <div className="zoom-buttons">
          <IconButton onClick={zoomIn} color="primary" aria-label="Zoom In">
            <ZoomInIcon />
          </IconButton>
          <IconButton onClick={zoomOut} color="primary" aria-label="Zoom Out">
            <ZoomOutIcon />
          </IconButton>
        </div>
      </div>
      <ProcessInfo tasks={tasks} />
    </div>
  );
};

export default BpmnDiagram;
