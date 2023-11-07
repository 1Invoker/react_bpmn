import React from 'react';

const StageInfo = ({ smevVersion, processId }) => {
  return (
    <div className="stage-info">
      {smevVersion && <p>SMEV Version: {smevVersion}</p>}
      {processId && <p>Process ID: {processId}</p>}
    </div>
  );
};

export default StageInfo;
