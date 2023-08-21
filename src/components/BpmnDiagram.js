import React, { useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

const BpmnDiagram = ({ xml }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const viewer = new BpmnViewer({ container: containerRef.current });

    viewer.importXML(xml, (err) => {
      if (err) {
        console.error('Ошибка при отображении BPMN-диаграммы', err);
      }
    });

    return () => viewer.destroy();
  }, [xml]);

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
};

export default BpmnDiagram;
