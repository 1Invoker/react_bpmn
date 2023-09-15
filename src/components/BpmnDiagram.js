import React, { useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const BpmnDiagram = ({ xml }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    viewerRef.current = new BpmnViewer({ container: containerRef.current });

    viewerRef.current.importXML(xml)
      .then(() => {
        console.log('BPMN-диаграмма успешно загружена');
      })
      .catch((err) => {
        console.error('Ошибка при отображении BPMN-диаграммы', err);
      });

    return () => viewerRef.current.destroy();
  }, [xml]);

  const zoomIn = () => {
    const newScale = viewerRef.current.get('canvas').zoom() * 1.1;
    viewerRef.current.get('canvas').zoom(newScale);
  };

  const zoomOut = () => {
    const newScale = viewerRef.current.get('canvas').zoom() * 0.9;
    viewerRef.current.get('canvas').zoom(newScale);
  };

  return (
    <div className="bpmn-diagram-container" ref={containerRef}>
      <Button onClick={zoomIn} variant="contained" color="primary">
        <AddIcon />
        Zoom In
      </Button>
      <Button onClick={zoomOut} variant="contained" color="primary">
        <RemoveIcon />
        Zoom Out
      </Button>
    </div>
  );
};

export default BpmnDiagram;
