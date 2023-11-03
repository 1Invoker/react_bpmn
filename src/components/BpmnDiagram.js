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
            element.type === 'bpmn:formProperty'
          );
        });

        const taskData = bpmnElements.map((element) => {
          return {
            id: element.id,
            name: element.businessObject.name,
            type: element.type,
            additionalId: element.businessObject.id,
          };
        });

        setTasks(taskData);
      } else {
        console.error('Ошибка при отображении BPMN-диаграммы', err);
      }
    });

    // Добавляем обработчик перемещения компонентов
    viewerRef.current.on('element.click', (event) => {
      const element = event.element;
      // Здесь можно добавить логику для перемещения элементов
      // Например, можно использовать библиотеку для перетаскивания элементов
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
