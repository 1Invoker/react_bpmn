import React, { useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

const BpmnViewerComponent = ({ xml, selectedTask }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    viewerRef.current = new BpmnViewer({ container: containerRef.current });

    viewerRef.current.importXML(xml)
      .then(() => {
        console.log('BPMN-диаграмма успешно загружена');
        if (selectedTask) {
          const element = viewerRef.current.get('elementRegistry').get(selectedTask.id);
          viewerRef.current.get('selection').select(element);
        }
      })
      .catch((err) => {
        console.error('Ошибка при отображении BPMN-диаграммы', err);
      });

    return () => viewerRef.current.destroy();
  }, [xml, selectedTask]);

  return <div className="bpmn-viewer-container" ref={containerRef}></div>;
};

export default BpmnViewerComponent;
