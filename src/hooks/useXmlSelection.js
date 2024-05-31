import { useState } from 'react';

const useXmlSelection = () => {
  const [xsdXmls, setXsdXmls] = useState([]);
  const [selectedXml, setSelectedXml] = useState('');
  const [showBpmnAnalyz, setShowBpmnAnalyz] = useState(true);

  const handleXmlChange = (xml, fileName) => {
    setXsdXmls(prevXmls => [...prevXmls, { xml, fileName }]);
  };

  const handleSelectXml = xml => {
    setSelectedXml(xml);
  };

  const handleFileSelect = xml => {
    setSelectedXml(xml);
    setShowBpmnAnalyz(true);
  };

  const handleConverterClick = () => {
    setShowBpmnAnalyz(prevShow => !prevShow);
  };

  return {
    xsdXmls,
    selectedXml,
    showBpmnAnalyz,
    handleXmlChange,
    handleSelectXml,
    handleFileSelect,
    handleConverterClick,
  };
};

export default useXmlSelection;
