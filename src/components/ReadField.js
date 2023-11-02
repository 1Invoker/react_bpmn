import React, { useEffect, useRef } from 'react';
import BpmnJS from 'bpmn-js';

function ReadField() {
  const bpmnModelerRef = useRef(null);

  function exportDiagram() {
    bpmnModelerRef.current.saveXML({ format: true })
      .then((result) => {
        const xml = result.xml;
        alert('Diagram exported. Check the developer tools!');
        console.log('DIAGRAM', xml);
      })
      .catch((error) => {
        console.error('Could not save BPMN 2.0 diagram', error);
      });
  }

  useEffect(() => {
    const diagramUrl = 'https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/colors/resources/pizza-collaboration.bpmn';

    bpmnModelerRef.current = new BpmnJS({
      container: '#canvas',
      keyboard: {
        bindTo: window
      }
    });

    function openDiagram(bpmnXML) {
      bpmnModelerRef.current.importXML(bpmnXML)
        .then(() => {
          const canvas = bpmnModelerRef.current.get('canvas');
          const overlays = bpmnModelerRef.current.get('overlays');

          // Enable zooming
          canvas.zoom('fit-viewport');

          // Enable panning (dragging)
          canvas.getContainer().style.cursor = 'move';

          // Enable element creation
          bpmnModelerRef.current.get('palette').open();
        })
        .catch((error) => {
          console.error('Could not import BPMN 2.0 diagram', error);
        });
    }

    fetch(diagramUrl)
      .then((response) => response.text())
      .then((bpmnXML) => openDiagram(bpmnXML))
      .catch((error) => {
        console.error('Could not load diagram', error);
      });
  }, []);

  return (
    <div>
      <div id="canvas"></div>
      <button id="save-button" onClick={exportDiagram}>Export Diagram</button>
    </div>
  );
}

export default ReadField;
